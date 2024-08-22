import type { RequestHandler } from './$types';
import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAI } from 'openai';
import { error, json } from '@sveltejs/kit';

async function getGameInfo() {
    const url = 'https://fantasy.premierleague.com/api/bootstrap-static/';
    const response = await fetch(url);
    return await response.json();
}

function getLatestFinishedGameWeek(events : GameweekEvent[]) {
    return events
        .filter(event => event.finished)   // Filter only the objects where 'finished' is true
        .map(event => event.id)            // Map to get the ids of those objects
        .pop() || null;                // Get the last id in the list, or return null if none
}

async function getTeamInfo(teamId : string) {
    const url = `https://fantasy.premierleague.com/api/entry/${teamId}/`;
    const response = await fetch(url);
    return await response.json();
}
    

async function getTeamById(teamId : string, gameweek : number) {
    const url = `https://fantasy.premierleague.com/api/entry/${teamId}/event/${gameweek}/picks/`;
    const response = await fetch(url);
    return await response.json();
}

async function playerInfoByGameweek(playerObj : Player, gameweek : number, totalPlayers : number) {
	gameweek = gameweek - 1;
	const url = `https://fantasy.premierleague.com/api/element-summary/${playerObj.id}/`;
	const response = await fetch(url);
	const player = await response.json();
	const playerPerformance = player.history;

	const playerInfo : PlayerPerformance = {
		web_name: playerObj.web_name,
		full_name: playerObj.full_name,
		position: playerObj.position,
		is_captain: playerObj.is_captain,
		total_points: `${playerPerformance[gameweek].total_points * playerObj.multiplier}`,
		bonus: playerPerformance[gameweek].bonus,
		pct_selected_by: `${((playerPerformance[gameweek].selected / totalPlayers) * 100).toFixed(2)}`
	};

	return playerInfo;
}

function updatePlayerNamesAndPositions(picks: PlayerPick[], elementsInfo: PlayerElement[]) {
    // Define position types
    const positionTypes: { [key: number]: string } = {
        1: 'Goalkeeper',
        2: 'Defender',
        3: 'Midfielder',
        4: 'Forward'
    };

    // Create a dictionary for quick lookup
    const elementDict: { [key: number]: { full_name: string | undefined; web_name: string | undefined; position: string | undefined } } = elementsInfo.reduce((acc, element) => {
        acc[element.id] = {
            full_name: `${element.first_name} ${element.second_name}`,
            web_name: element.web_name,
            position: positionTypes[element.element_type] || 'Unknown'
        };
        return acc;
    }, {} as { [key: number]: { full_name: string | undefined; web_name: string | undefined; position: string | undefined } });

    // Update picks with corresponding web_name, full_name, and position
    picks.forEach(pick => {
        const playerInfo = elementDict[pick.element] || { full_name: undefined, web_name: undefined, position: undefined };
        pick.full_name = playerInfo.full_name;
        pick.web_name = playerInfo.web_name;
        pick.position = playerInfo.position;
    });

    return picks;
}


async function getTeamGwPerformance(teamId : string) {
    // meta data
    const gameInfo = await getGameInfo();
    const totalPlayers = gameInfo.total_players;
    const elementsInfo = gameInfo.elements; // list of all players
    const gameweek = getLatestFinishedGameWeek(gameInfo.events);
    if (!gameweek) {
        return null;
    }

    const teamInfo = await getTeamInfo(teamId);
    const teamName = teamInfo.name;
    
    const gwInfo = await getTeamById(teamId, gameweek);
    const picks = updatePlayerNamesAndPositions(gwInfo.picks, elementsInfo);

    // we want total points, highest points, overall rank
    const totalPoints = gwInfo.entry_history.total_points;
    const percentile = gwInfo.entry_history.percentile_rank;
    const highestPoints = gameInfo.events[gameweek - 1].highest_score;
    const averagePoints = gameInfo.events[gameweek - 1].average_entry_score;
    const overallRank = gwInfo.entry_history.overall_rank;
    const firstTeamPerformance = [];

    for (let i = 0; i < 11; i++) {
        const pick = picks[i];
        const player = {
            id: pick.element,
            // full_name: pick.full_name,
            web_name: pick.web_name,
            position: pick.position,
            multiplier: pick.multiplier,
            is_captain: pick.is_captain,
        };
        const playerInfo = await playerInfoByGameweek(player, gameweek, totalPlayers);
        firstTeamPerformance.push(playerInfo);
    }

    const teamPerformance = {
        team_name : teamName,
        total_points: totalPoints,
        highest_points: highestPoints,
        average_points: averagePoints,
        first_team_performance: firstTeamPerformance
    };

    return teamPerformance;
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const POST: RequestHandler = async ({ request }) => {

    let requestData;

    try {
        requestData = await request.json();
    } catch (err) {
        console.error('Error parsing request body:', err);
        throw error(400, 'Invalid JSON in request body.');
    }

    try {

        const { inputText } = requestData;

        // convert fplid to a number
        var fplId = parseInt(inputText, 10);
        if (isNaN(fplId)) {
            throw error(400, 'Invalid input. Please provide a valid FPL ID.');
        }

        
        const teamPerformance = await getTeamGwPerformance(fplId.toString());
        const prompt = `You are a roast master, your task is to roast an individual manager's fantasy premier league team depending on the data provided. You will be given a name, % selected by, and total points scored by that player. Emphasise on roasting the wankness of the individual manager that selected the team. Here's the team ${JSON.stringify(teamPerformance)}`

        const completionResponse = await openai.chat.completions.create({
            messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
            temperature : 0.7,
            max_tokens : 4000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            model: "gpt-3.5-turbo",
            stream: true
        });

        const headers = {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        };

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of completionResponse) {
                    controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
                }
                controller.close();
            }
        });

        return new Response(stream, { headers });

    } catch (err) {
        throw error(500, 'Failed to fetch data.');
    }
};