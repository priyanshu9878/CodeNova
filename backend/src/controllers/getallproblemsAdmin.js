export const getAllProblemsAdmin = async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("_id title difficulty tags")
      .sort({ createdAt: -1 });

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
};