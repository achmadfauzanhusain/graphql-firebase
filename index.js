import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { getDocs, getDoc, doc } from "firebase/firestore";
import { colHobby, colPeople } from './db/firebase.js';

const typeDefs = `#graphql
  type Hobby {
    id: ID,
    hobby: String,
    reason: String,
    peoples: [People]
  }
  type People {
    id: ID,
    name: String,
    hobbies: [Hobby]
  }
  type Query {
    hobbies: [Hobby]
    hobby(id: ID!): Hobby
    peoples: [People]
    people(id: ID!): People
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
    },
    hobby: async(_, args) => {
      const snapshot = await getDoc(doc(colHobby, args.id));
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    },
    peoples: async() => {
      const snapshot = await getDocs(colPeople);

      const peoples = [];
      snapshot.forEach((doc) => {
        peoples.push({ id: doc.id, ...doc.data() });
      });

      return peoples;
    },
    people: async(_, args) => {
      const snapshot = await getDoc(doc(colPeople, args.id));
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    }
  },
  Hobby: {
    async peoples(parent) {
      const snapshot = await getDocs(colPeople);
      const peoples = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        // cari people yang punya hobbyId ini
        if (data.hobbies?.includes(parent.id)) {
          peoples.push({ id: doc.id, ...data });
        }
      });

      return peoples;
    }
  },
  People: {
    async hobbies(parent) {
      // parent.hobbies sudah ada dari dokumen people
      if (!parent.hobbies || parent.hobbies.length === 0) return [];
      
      const hobbyPromises = parent.hobbies.map((id) => getDoc(doc(colHobby, id)));
      const snapshots = await Promise.all(hobbyPromises);
      return snapshots
        .filter((snap) => snap.exists())
        .map((snap) => ({ id: snap.id, ...snap.data() }));
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