import skillsData from './data/skills.json';

export const SkillsService = {
  getAllSkills: () => skillsData.skills,
};