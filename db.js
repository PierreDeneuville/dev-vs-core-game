import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
});

export async function getScores() {
  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('leaderboard')), { size: 10 }),
        q.Lambda('X', q.Get(q.Var('X')))
      )
    );

    return result.data.map(item => ({
      name: item.data.name,
      score: item.data.score,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des scores:', error);
    throw error;
  }
}

export async function saveScore(name, score) {
  try {
    await client.query(
      q.Create(q.Collection('leaderboard'), {
        data: { name, score },
      })
    );
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du score:', error);
    throw error;
  }
}