import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Save } from 'lucide-react';

function RecipeEditor({ recipe, onSave }) {
  const [formData, setFormData] = useState(recipe || {
    name: '',
    ingredients: [],
    instructions: []
  });

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { name: '', quantity: '', unit: '' }
      ]
    });
  };

  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value
    };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, '']
    });
  };

  const removeInstruction = (index) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index)
    });
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipe Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kt-primary focus:border-kt-primary"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Ingredients
          </label>
          <button
            type="button"
            onClick={addIngredient}
            className="text-kt-primary hover:text-kt-primary-dark"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                placeholder="Ingredient"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kt-primary focus:border-kt-primary"
              />
              <input
                type="number"
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                placeholder="Qty"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kt-primary focus:border-kt-primary"
              />
              <input
                type="text"
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                placeholder="Unit"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kt-primary focus:border-kt-primary"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Minus size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Instructions
          </label>
          <button
            type="button"
            onClick={addInstruction}
            className="text-kt-primary hover:text-kt-primary-dark"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {formData.instructions.map((instruction, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="mt-2 text-gray-500">{index + 1}.</span>
              <textarea
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder="Instruction step"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kt-primary focus:border-kt-primary"
                rows={2}
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Minus size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-kt-primary text-white rounded-md hover:bg-kt-primary-dark transition-colors"
        >
          <Save size={16} className="mr-2" />
          Save Recipe
        </button>
      </div>
    </form>
  );
}

export default RecipeEditor;