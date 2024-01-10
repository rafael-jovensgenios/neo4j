export default {
  Query: {
    answer: async (_, args, context, requestInfo) => {
      return { name: "answer" };
    },
  },
  Mutation: {
    registerStudentAnswer: async (_, args, context, requestInfo) => {
      return "ok";
    },
  },
};
