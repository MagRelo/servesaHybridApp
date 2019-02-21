import store from 'state/store';

export async function loadLeaderboard() {
  store.dispatch({
    type: 'LOAD_PGA_DATA',
    payload: {
      teamsLoaded: false
    }
  });

  const leaderboard = await fetch(
    'https://statdata.pgatour.com/r/473/2019/leaderboard-v2.json'
  ).then(response => response.json());

  const allPlayers = await fetch(
    'https://statdata.pgatour.com/players/player.json'
  ).then(response => response.json());

  // Leaderboard
  const leaderboardPlayers = leaderboard.leaderboard.players;
  const currentRound = leaderboard.leaderboard.current_round;
  const currentRoundState = leaderboard.leaderboard.round_state;
  const lastUpdated = new Date(leaderboard.last_updated);

  // merge scores into teams and get totals
  const teams = store.getState().team.teams;
  const teamScores = teamTotals(teams, allPlayers.plrs, leaderboardPlayers);

  var updateOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

  store.dispatch({
    type: 'UPDATE_PGA_DATA',
    payload: {
      tournament: {
        name: leaderboard.leaderboard.tournament_name,
        roundState: `Round ${currentRound} - ${currentRoundState}`,
        lastUpdated: lastUpdated.toLocaleString('en-US', updateOptions)
      },
      teams: teamScores,
      teamsLoaded: true
    }
  });
}

function teamTotals(teams, playerList, leaderboard) {
  // each team
  const hydratedTeams = teams.map(team => {
    // get players from leaderboard
    let activePlayers = [];
    let allPlayers = [];

    // each player
    team.playerList.forEach((teamPlayer, index) => {
      // add player data
      const playerObj = playerList.find(listItem => {
        return listItem.pid === teamPlayer;
      });

      // if found, add to active players
      playerObj.active = false;
      const activePlayerObj = leaderboard.find(listItem => {
        return listItem.player_id === teamPlayer;
      });
      if (activePlayerObj) {
        playerObj.leaderBoard = activePlayerObj;
        playerObj.active = true;
        activePlayers.push(activePlayerObj);
      }

      // add full player to array
      allPlayers.push(playerObj);
    });

    const teamTotal = activePlayers.reduce((acc, player, index) => {
      return acc + player.rankings.projected_money_event;
    }, 0);

    // sort leaderboard players
    activePlayers.sort((a, b) => {
      return (
        b.rankings.projected_money_event - a.rankings.projected_money_event
      );
    });

    // add to team
    team.players = allPlayers;
    team.activePlayers = activePlayers;
    team.teamTotal = teamTotal;

    return team;
  });

  // sort
  hydratedTeams.sort((a, b) => {
    return b.teamTotal - a.teamTotal;
  });

  return hydratedTeams;
}

// Page: 101  - Description: Driving Distance
// Page: 102  - Description: Driving Accuracy Percentage
// Page: 103  - Description: Greens in Regulation Percentage
// Page: 104  - Description: Putting Average
// Page: 105  - Description: Par Breakers
// Page: 106  - Description: Total Eagles
// Page: 107  - Description: Total Birdies
// Page: 108  - Description: Scoring Average (Actual)
// Page: 109  - Description: Charles Schwab Cup Money List
// Page: 110  - Description: Champions Career Money Leaders
// Page: 111  - Description: Sand Save Percentage
// Page: 112  - Description: Par 3 Birdie or Better Leaders
// Page: 113  - Description: Par 4 Birdie or Better Leaders
// Page: 114  - Description: Par 5 Birdie or Better Leaders
// Page: 115  - Description: Birdie or Better Conversion Percentage
// Page: 117  - Description: Round 3 Scoring Average
// Page: 118  - Description: Scoring Average Final Rnd
// Page: 119  - Description: Putts Per Round
// Page: 121  - Description: All Time Money Leaders
// Page: 125  - Description: Constellation SENIOR PLAYERS Points
// Page: 127  - Description: All-Around Ranking
// Page: 129  - Description: Total Driving
// Page: 130  - Description: Scrambling
// Page: 138  - Description: Top 10 Finishes
// Page: 142  - Description: Par 3 Scoring Average
// Page: 143  - Description: Par 4 Scoring Average
// Page: 144  - Description: Par 5 Scoring Average
// Page: 148  - Description: Round 1 Scoring Average
// Page: 149  - Description: Round 2 Scoring Average
// Page: 152  - Description: Rounds in the 60's
// Page: 153  - Description: Sub Par Rounds
// Page: 154  - Description: Money per Event Leaders
// Page: 155  - Description: Eagles (Holes per)
// Page: 156  - Description: Birdie Average
// Page: 158  - Description: Ball Striking
// Page: 159  - Description: Longest Drives
// Page: 160  - Description: Bounce Back
// Page: 171  - Description: Par 3 Performance
// Page: 172  - Description: Par 4 Performance
// Page: 173  - Description: Par 5 Performance
// Page: 194  - Description: Total Money (Official and Unofficial)
// Page: 200  - Description: Career Victories
// Page: 207  - Description: Front 9 Scoring Average
// Page: 208  - Description: Back 9 Scoring Average
// Page: 209  - Description: First Tee Early Scoring Average
// Page: 211  - Description: First Tee Late Scoring Average
// Page: 219  - Description: Final Round Performance
// Page: 220  - Description: Top 10 Final Round Performance
// Page: 221  - Description: Front 9 Par 3 Scoring Average
// Page: 222  - Description: Back 9 Par 3 Scoring Average
// Page: 223  - Description: Early Par 3 Scoring Average
// Page: 224  - Description: Late Par 3 Scoring Average
// Page: 225  - Description: First Tee Early Par 3 Scoring Average
// Page: 227  - Description: First Tee Late Par 3 Scoring Average
// Page: 229  - Description: Front 9 Par 4 Scoring Average
// Page: 230  - Description: Back 9 Par 4 Scoring Average
// Page: 231  - Description: Early Par 4 Scoring Average
// Page: 232  - Description: Late Par 4 Scoring Average
// Page: 233  - Description: First Tee Early Par 4 Scoring Average
// Page: 235  - Description: First Tee Late Par 4 Scoring Average
// Page: 237  - Description: Front 9 Par 5 Scoring Average
// Page: 238  - Description: Back 9 Par 5 Scoring Average
// Page: 239  - Description: Early Par 5 Scoring Average
// Page: 240  - Description: Late Par 5 Scoring Average
// Page: 241  - Description: First Tee Early Par 5 Scoring Average
// Page: 243  - Description: First Tee Late Par 5 Scoring Average
// Page: 245  - Description: Front 9 Round 1 Scoring Average
// Page: 246  - Description: Back 9 Round 1 Scoring Average
// Page: 247  - Description: Early Round 1 Scoring Average
// Page: 248  - Description: Late Round 1 Scoring Average
// Page: 249  - Description: First Tee Early Round 1 Scoring Average
// Page: 251  - Description: First Tee Late Round 1 Scoring Average
// Page: 253  - Description: Front 9 Round 2 Scoring Average
// Page: 254  - Description: Back 9 Round 2 Scoring Average
// Page: 255  - Description: Early Round 2 Scoring Average
// Page: 256  - Description: Late Round 2 Scoring Average
// Page: 257  - Description: First Tee Early Round 2 Scoring Average
// Page: 259  - Description: First Tee Late Round 2 Scoring Average
// Page: 261  - Description: Front 9 Round 3 Scoring Average
// Page: 262  - Description: Back 9 Round 3 Scoring Average
// Page: 263  - Description: Early Round 3 Scoring Average
// Page: 264  - Description: Late Round 3 Scoring Average
// Page: 265  - Description: First Tee Early Round 3 Scoring Average
// Page: 267  - Description: First Tee Late Round 3 Scoring Average
