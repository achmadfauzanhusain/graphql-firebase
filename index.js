import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { getDocs } from "firebase/firestore";
import { colHobby } from './db/firebase.js';

const typeDefs = `#graphql
  type Hobby {
    id: ID,
    hobby: String,
    reason: String
  }
  type Query {
    hobbies: [Hobby]
  }
`;

const resolvers = {
  Query: {
    hobbies: async () => {
      const snapshot = await getDocs(colHobby);

      const hobbies = [];
      snapshot.forEach((doc) => {
        hobbies.push({ id: doc.id, ...doc.data() });
      });

      return hobbies;
    }
  }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const url = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at port 4000`);