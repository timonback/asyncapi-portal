import yaml from "js-yaml";
import {
  Graph,
  GraphApplications,
  GraphLink,
  GraphQueues,
  GraphServers,
  LinkDirection,
} from "../../types/main";
import { generateSequence } from "../../types/number_sequence";

const idGenerator = generateSequence(0, 10000);

interface RelaxedAsyncApiMessageSchema {
  name?: string;
  title?: string;
  $ref?: string;
}

interface RelaxedAsyncApiOneOfMessageSchema {
  oneOf: [RelaxedAsyncApiMessageSchema];
}

interface RelaxedAsyncApiOperationSchema {
  message: RelaxedAsyncApiMessageSchema | RelaxedAsyncApiOneOfMessageSchema;
}

interface RelaxedAsyncApiComponentSchema {
  [keyof: string]: RelaxedAsyncApiComponentSchema | string;
}

interface RelaxedAsyncApiSchema {
  info: {
    title: string;
  };
  channels: Map<
    string,
    {
      servers: [string];
      publish?: RelaxedAsyncApiOperationSchema;
      subscribe?: RelaxedAsyncApiOperationSchema;
    }
  >;
  components: RelaxedAsyncApiComponentSchema;
  servers: Map<string, { url: string }>;
}

export async function processAsyncApiFiles(
  asyncApisAsString: string[]
): Promise<Graph> {
  const asyncApis = asyncApisAsString.map((asyncApiAsString) => {
    if (asyncApiAsString.charAt(0) == "{") {
      return JSON.parse(asyncApiAsString);
    }
    return yaml.safeLoad(asyncApiAsString);
  });

  const servers = getServers(asyncApis);
  const applications = getApplications(asyncApis);
  const queues = getQueues(asyncApis, servers);
  return {
    servers: servers,
    applications: applications,
    queues: queues,
    links: getLinks(asyncApis, applications, queues),
  };
}

function getServers(apis: RelaxedAsyncApiSchema[]): GraphServers {
  let servers: GraphServers = {};

  [
    ...new Set<string>(
      apis
        .map((api) => api.servers)
        .flatMap((servers) => Object.values(servers))
        .map((server) => server.url)
    ),
  ].forEach((value) => {
    servers[value] = { id: idGenerator.next().value };
  });

  return servers;
}

function getApplications(apis: RelaxedAsyncApiSchema[]): GraphApplications {
  let applications: GraphApplications = {};

  [...new Set(apis.map((api) => api.info.title))].forEach((value) => {
    applications[value] = { id: idGenerator.next().value };
  });

  return applications;
}

function getQueues(
  apis: RelaxedAsyncApiSchema[],
  servers: GraphServers
): GraphQueues {
  let queues: GraphQueues = {};
  apis
    .map((api) => {
      return {
        servers: api.servers,
        channels: api.channels,
      };
    })
    .flatMap((data) => {
      return Object.keys(data.channels).map((channelName) => {
        let serverKey = "unknown.com"
        if(data.channels[channelName].servers !== undefined) {
          serverKey = data.channels[channelName].servers[0]
        } else if(data.channels[channelName]?.subscribe?.bindings !== undefined) {
          serverKey = Object.keys(data.channels[channelName].subscribe.bindings)[0]
        } else if(data.channels[channelName]?.publish?.bindings !== undefined) {
          serverKey = Object.keys(data.channels[channelName].publish.bindings)[0]
        }
        return {
          serverUrl: data.servers[serverKey].url,
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

function getLinks(
  apis: RelaxedAsyncApiSchema[],
  applications: GraphApplications,
  queues: GraphQueues
): GraphLink[] {
  return [
    ...apis
      .map((api) => {
        return {
          applicationName: api.info.title,
          channels: api.channels,
          components: api.components,
        };
      })
      .flatMap((data) => {
        return Object.keys(data.channels).map((channelName) => {
          return {
            applicationName: data.applicationName,
            channelName: channelName,
            channel: data.channels[channelName],
            components: data.components,
          };
        });
      })
      .filter((data) => data.channel.subscribe)
      .map((data) => {
        return {
          applicationId: applications[data.applicationName].id,
          queueId: queues[data.channelName].id,
          direction: LinkDirection.subscribe,
          messageType: getMessages(data.channel.subscribe, data.components),
        };
      }),
    ...apis
      .map((api) => {
        return {
          applicationName: api.info.title,
          channels: api.channels,
          components: api.components,
        };
      })
      .flatMap((data) => {
        return Object.keys(data.channels).map((channelName) => {
          return {
            applicationName: data.applicationName,
            channelName: channelName,
            channel: data.channels[channelName],
            components: data.components,
          };
        });
      })
      .filter((data) => data.channel.publish)
      .map((data) => {
        return {
          applicationId: applications[data.applicationName].id,
          queueId: queues[data.channelName].id,
          direction: LinkDirection.publish,
          messageType: getMessages(data.channel.publish, data.components),
        };
      }),
  ];
}

function getMessages(
  operation: RelaxedAsyncApiOperationSchema,
  components: RelaxedAsyncApiComponentSchema
): string {
  if (operation) {
    if ("oneOf" in operation.message) {
      return operation.message.oneOf
        .map((message) => getMessageName(message, components))
        .join(", ");
    }
    return getMessageName(operation.message, components);
  }
  return "invalid";
}

function getMessageName(
  message: RelaxedAsyncApiMessageSchema,
  components: RelaxedAsyncApiComponentSchema
): string {
  if (message.title) {
    return message.title;
  }
  if (message.name) {
    return message.name;
  }

  let refSegments = message.$ref?.substring(2).split("/");
  refSegments?.shift();
  let segment: RelaxedAsyncApiComponentSchema | string | undefined = components;
  while (
    segment !== undefined &&
    refSegments !== undefined &&
    refSegments.length > 0
  ) {
    const index = refSegments.shift() as string;
    segment = segment[index];
  }

  if (segment["title"]) {
    return segment["title"];
  }
  if (segment["name"]) {
    return segment["name"];
  }

  return "unknown";
}
