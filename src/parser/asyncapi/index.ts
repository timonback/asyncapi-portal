import { AsyncAPIDocument, Operation, parse } from "@asyncapi/parser";
import {
  Graph,
  GraphApplications,
  GraphLink,
  GraphQueues,
  GraphServers,
  LinkDirection,
} from "../../types/main";
import { generateSequence } from "../../types/number_sequence";

// support browser and node typescript target
const parser = parse || window.AsyncAPIParser.parse;

const idGenerator = generateSequence(0, 10000);

export async function processAsyncApiFiles(
  asyncApisAsString: string[]
): Promise<Graph> {
  const asyncApis = asyncApisAsString.map((asyncApiAsString) => {
    return parser(asyncApiAsString);
  });
  const apis = await Promise.all(asyncApis);
  const servers = await getServers(apis);
  const applications = await getApplications(apis);
  const queues = await getQueues(apis, servers);

  const links = await getLinks(apis, applications, queues);
  return {
    servers: servers,
    applications: applications,
    queues: queues,
    links: links,
  };
}

async function getServers(apis: AsyncAPIDocument[]): Promise<GraphServers> {
  let servers: GraphServers = {};

  [
    ...new Set<string>(
      apis
        .map((api) => api.servers())
        .flatMap((servers) => Object.values(servers))
        .map((server) => server.url())
    ),
  ].forEach((value) => {
    servers[value] = { id: idGenerator.next().value };
  });

  return servers;
}

async function getApplications(
  apis: AsyncAPIDocument[]
): Promise<GraphApplications> {
  let applications: GraphApplications = {};
  [...new Set(apis.map((api) => getApplicationName(api)))].forEach((value) => {
    applications[value] = { id: idGenerator.next().value };
  });

  return applications;
}

async function getQueues(
  apis: AsyncAPIDocument[],
  servers: GraphServers
): Promise<GraphQueues> {
  let queues: GraphQueues = {};
  apis
    .map((api) => {
      return {
        servers: api.servers(),
        channels: api.channels(),
        channelNames: api.channelNames(),
      };
    })
    .flatMap((data) => {
      return data.channelNames.map((channelName) => {
        return {
          serverUrl: data.servers[data.channels[channelName].server(0)].url(),
          channelName: channelName,
        };
      });
    })
    .forEach((data) => {
      queues[data.channelName] = {
        id: idGenerator.next().value,
        serverId: servers[data.serverUrl].id,
      };
    });

  return queues;
}

async function getLinks(
  apis: AsyncAPIDocument[],
  applications: GraphApplications,
  queues: GraphQueues
): Promise<GraphLink[]> {
  return [
    ...apis
      .map((api) => {
        return {
          applicationName: getApplicationName(api),
          channelNames: api.channelNames(),
          api: api,
        };
      })
      .flatMap((data) => {
        return Object.values(data.channelNames).map((channelName) => {
          return {
            applicationName: data.applicationName,
            channelName: channelName,
            channel: data.api.channel(channelName),
          };
        });
      })
      .filter((data) => data.channel.hasSubscribe())
      .map((data) => {
        return {
          applicationId: applications[data.applicationName].id,
          queueId: queues[data.channelName].id,
          direction: LinkDirection.subscribe,
          messageType: getMessages(data.channel.subscribe()),
        };
      }),
    ...apis
      .map((api) => {
        return {
          applicationName: getApplicationName(api),
          channelNames: api.channelNames(),
          api: api,
        };
      })
      .flatMap((data) => {
        return Object.values(data.channelNames).map((channelName) => {
          return {
            applicationName: data.applicationName,
            channelName: channelName,
            channel: data.api.channel(channelName),
          };
        });
      })
      .filter((data) => data.channel.hasPublish())
      .map((data) => {
        return {
          applicationId: applications[data.applicationName].id,
          queueId: queues[data.channelName].id,
          direction: LinkDirection.publish,
          messageType: getMessages(data.channel.publish()),
        };
      }),
  ];
}

function getApplicationName(api: AsyncAPIDocument): string {
  return api.info().title();
}

function getMessages(operation: Operation): string {
  if (operation.hasMultipleMessages()) {
    return operation
      .messages()
      .map((message) => message.title())
      .join(", ");
  }
  return operation.message().title();
}
