// const { projects, clients } = require("../sampleData.js");

// mongoose models

const Project = require("../models/Project");
const Client = require("../models/Client");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

// Client Type

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// Project Type

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
        type: ClientType,
        resolve(parent, args) {
          return Client.findById(parent.clientId)
        },
      },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    client: {
      type: ClientType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Client.findById(args.id)
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      },
    },
    project: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      },
    },
  },
});

// Mutations

const mutation = new GraphQLObjectType({
  name:"mutation",
  fields:{
    //Add a Client
    addClient:{
      type: ClientType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString) },
        email: {type: new GraphQLNonNull(GraphQLString) },
        phone: {type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args){
        const client = new Client({ /// Create the entity
          name: args.name,
          email: args.email,
          phone: args.phone,
        })
        return client.save(); /// Save the entity
      }
    },
    /// Delete a client
    deleteClient:{
      type: ClientType,
      args:{
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parents, args){
        return Client.findByIdAndDelete(args.id)
      } 
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
