const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');
const Academy = require('./models/Academy');
const Opportunity = require('./models/Opportunity');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing old data...');

  await User.deleteMany({});
  await Post.deleteMany({});
  await Academy.deleteMany({});
  await Opportunity.deleteMany({});

  const defaultPassword = await bcrypt.hash('password123', 10);

  const usersData = [
    {
      name: 'Rahul Sharma', email: 'rahul@example.com', password: defaultPassword,
      role: 'Athlete', sport: 'Cricket', position: 'Right-hand Batsman',
      city: 'Delhi', college: 'ABC College',
      stats: { achievements: 8, matches: 12, awards: 3 },
      skills: ['Batting', 'Bowling', 'Fielding'],
      resume: [
        { medal: 'gold', title: 'District Cricket Championship', year: '2025' },
        { medal: 'silver', title: 'State U-19 Tournament', year: '2025' },
        { medal: 'trophy', title: 'College Cricket League', year: '2026' },
      ],
      about: 'Opening batsman for ABC College. Training six days a week with the district squad and looking for state-level trials.',
      contact: 'rahul.sharma@example.com',
    },
    {
      name: 'Arjun Mehta', email: 'arjun@example.com', password: defaultPassword,
      role: 'Athlete', sport: 'Athletics', position: '100m Sprinter',
      city: 'Jaipur', college: 'Rajasthan University',
      stats: { achievements: 6, matches: 18, awards: 4 },
      skills: ['Sprinting', 'Relay', 'Long jump'],
      resume: [
        { medal: 'gold', title: 'State Athletics Gala — 100m', year: '2026' },
        { medal: 'silver', title: 'Inter-University Relay', year: '2025' },
        { medal: 'trophy', title: 'District Track Meet', year: '2024' },
      ],
      about: 'Personal best 11.2s in the 100m. Early-morning track athlete with a relay background.',
      contact: 'arjun.mehta@example.com',
    },
    {
      name: 'Sana Qureshi', email: 'sana@example.com', password: defaultPassword,
      role: 'Athlete', sport: 'Football', position: 'Left Winger',
      city: 'Noida', college: 'Amity College',
      stats: { achievements: 5, matches: 24, awards: 2 },
      skills: ['Dribbling', 'Crossing', 'Finishing'],
      resume: [
        { medal: 'gold', title: "City Women's League", year: '2025' },
        { medal: 'trophy', title: 'College Football Cup', year: '2026' },
        { medal: 'silver', title: 'Zonal Championship', year: '2024' },
      ],
      about: "Left-footed forward comfortable on the wing, searching for a women's college league side.",
      contact: 'sana.qureshi@example.com',
    },
    {
      name: 'Neha Kapoor', email: 'neha@example.com', password: defaultPassword,
      role: 'Athlete', sport: 'Basketball', position: 'Point Guard',
      city: 'Pune', college: 'Fergusson College',
      stats: { achievements: 4, matches: 30, awards: 1 },
      skills: ['Playmaking', 'Three-point', 'Defence'],
      resume: [
        { medal: 'trophy', title: 'University Basketball League', year: '2026' },
        { medal: 'silver', title: 'State Junior Championship', year: '2025' },
        { medal: 'gold', title: 'District Basketball Meet', year: '2024' },
      ],
      about: 'Point guard leading the college side in assists for two seasons running.',
      contact: 'neha.kapoor@example.com',
    },
    {
      name: 'Imran Khan', email: 'imran@example.com', password: defaultPassword,
      role: 'Coach', sport: 'Football', position: 'Head Coach — Youth',
      city: 'Noida',
      stats: { achievements: 11, matches: 140, awards: 5 },
      skills: ['Youth development', 'Set pieces', 'Fitness'],
      resume: [
        { medal: 'trophy', title: 'State Youth League — Champions', year: '2025' },
        { medal: 'gold', title: 'Coach of the Season', year: '2024' },
        { medal: 'silver', title: 'Regional Academy Cup', year: '2023' },
      ],
      about: 'Twelve years coaching youth football. Runs weekend trials for U-17 and U-19 squads.',
      contact: 'imran.khan@example.com',
    },
  ];

  const users = await User.insertMany(usersData);
  console.log(`Inserted ${users.length} users`);

  const findUser = (name) => users.find((u) => u.name === name)._id;

  const postsData = [
    {
      author: findUser('Arjun Mehta'),
      text: 'Gold in the 100m at the State Athletics Gala. 11.2s — a new personal best. Grateful to the track crew and coach for the 5am sessions. 🥇',
      likes: [], comments: [],
    },
    {
      author: findUser('Sana Qureshi'),
      text: "Looking for a women's football team for the college league season. Left-footed forward, comfortable on the wing. Drop a message. ⚽",
      likes: [], comments: [],
    },
    {
      author: findUser('Rahul Sharma'),
      text: 'Won 1st place in the District Cricket Tournament — 74 not out in the final. On to the state camp next month. 🏆',
      likes: [], comments: [],
    },
    {
      author: findUser('Neha Kapoor'),
      text: 'Nine assists in the university semi-final. Court vision is a skill you can train — reps every single morning. 🏀',
      likes: [], comments: [],
    },
  ];

  const posts = await Post.insertMany(postsData);
  console.log(`Inserted ${posts.length} posts`);

  const academiesData = [
    { name: 'Delhi Cricket Academy', sport: 'Cricket', city: 'Delhi', rating: 4.5, coaches: 8, students: 240, about: 'Turf and net practice all week, with district-level selection camps every season.' },
    { name: 'United Football Academy', sport: 'Football', city: 'Noida', rating: 4.7, coaches: 6, students: 180, about: 'Youth football from U-13 to U-19, with a full-size floodlit pitch and weekend trials.' },
    { name: 'Jaipur Track Club', sport: 'Athletics', city: 'Jaipur', rating: 4.3, coaches: 4, students: 120, about: 'Sprint, relay and jump squads training on a synthetic eight-lane track.' },
    { name: 'Pune Hoops Centre', sport: 'Basketball', city: 'Pune', rating: 4.6, coaches: 5, students: 150, about: 'Indoor courts, strength room, and a college scholarship pathway programme.' },
  ];

  const academies = await Academy.insertMany(academiesData);
  console.log(`Inserted ${academies.length} academies`);

  const opportunitiesData = [
    { title: 'Cricket Trials', org: 'Delhi Cricket Association', sport: 'Cricket', city: 'Delhi', day: '20', month: 'Sept', date: '20 Sept 2026', details: 'Open trials for the U-21 district squad. Carry your own kit and college ID.' },
    { title: 'Football Academy Trials', org: 'United Football Academy', sport: 'Football', city: 'Noida', day: '25', month: 'Sept', date: '25 Sept 2026', details: 'Selection for the U-19 academy squad. Boys and girls squads assessed separately.' },
    { title: 'Inter-College Athletics', org: 'ABC University', sport: 'Athletics', city: 'Jaipur', day: '02', month: 'Oct', date: '2 Oct 2026', details: 'Track and field meet across sprints, relay, long jump and shot put.' },
    { title: 'State Basketball Camp', org: 'Pune Hoops Centre', sport: 'Basketball', city: 'Pune', day: '11', month: 'Oct', date: '11 Oct 2026', details: 'Five-day residential camp with state coaches and evening scrimmages.' },
  ];

  const opportunities = await Opportunity.insertMany(opportunitiesData);
  console.log(`Inserted ${opportunities.length} opportunities`);

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});