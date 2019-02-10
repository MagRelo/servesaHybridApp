const initialState = {
  tournament: {
    name: '',
    dates: '',
    course: '',
    roundState: '',
    lastUpdated: ''
  },
  teams: []
};

const AccountReducer = (state = initialState, action) => {
  if (action.type === 'LOAD_PGA_DATA') {
    return Object.assign({}, state, action.payload);
  }

  return state;
};

export default AccountReducer;
