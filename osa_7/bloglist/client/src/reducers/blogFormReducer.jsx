const blogFormReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "RESET":
      return { title: "", author: "", url: "" };
    default:
      return state;
  }
};

export default blogFormReducer;
