// // src/roles/kitchen/pages/Recipes.jsx
// import React from 'react';
// import { motion } from 'framer-motion';
// import RecipeEditor from '../components/RecipeEditor';

// const Recipes = () => {
//   const mockRecipes = [
//     { id: 1, name: 'Burger', ingredients: ['Beef Patty', 'Lettuce'], instructions: ['Grill beef patty', 'Assemble burger'] },
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="p-6 bg-[#F5F7FA] min-h-screen"
//     >
//       <h1 className="text-2xl font-bold text-[#FF6F61] mb-6">Recipes</h1>
//       <div className="space-y-4">
//         {mockRecipes.map((recipe) => (
//           <RecipeEditor key={recipe.id} recipe={recipe} onSave={() => {}} />
//         ))}
//       </div>
//     </motion.div>
//   );
// };

// export default Recipes;

import React from 'react';

export default function Recipes() {
  return (
    <div>
      <h2>Recipes</h2>
      <p>Manage your recipes here.</p>
    </div>
  );
}