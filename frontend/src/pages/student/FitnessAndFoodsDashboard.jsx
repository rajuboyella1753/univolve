// 📁 src/pages/student/FitnessAndFoodsDashboard.jsx

import React, { useEffect, useState } from "react";
import StuNav from "../StudentNavbar";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";

const fitnessPlans = {
  male: {
    title: "Fitness Plan for Boys",
    motivation: "Discipline builds strength. Stay committed, stay powerful. You are shaping your best version!",
    routine: [
      "🏃‍♂️ Run 1.5km every morning",
      "💪 20 pushups × 3 sets",
      "🧘‍♂️ 10 minutes yoga/stretch",
      "🏋️‍♂️ 25 squats + 25 situps",
      "🚴‍♂️ Optional cycling 2-5km"
    ],
    foods: {
      bulk: [
        { name: "🍚 Brown Rice", nutrients: "45g carbs, B vitamins", use: "Energy & glycogen" },
        { name: "🥩 Chicken Breast", nutrients: "26g protein per 100g", use: "Lean muscle building" },
        { name: "🥚 Eggs (3) + Milk", nutrients: "18g protein, B12, calcium", use: "Recovery & growth" },
        { name: "🥔 Sweet Potato", nutrients: "Carbs, fiber, Vitamin A", use: "Sustained energy" },
        { name: "🥜 Peanut Butter", nutrients: "8g protein, healthy fats", use: "Muscle mass, calories" },
        { name: "🍌 Banana", nutrients: "Potassium, carbs", use: "Pre-workout energy" },
        { name: "🥛 Protein Shake", nutrients: "25g protein per scoop", use: "Muscle gain" }
      ],
      cut: [
        { name: "🥗 Boiled Veggies", nutrients: "Low-calorie micronutrients", use: "Detox & digestion" },
        { name: "🐟 Grilled Fish", nutrients: "High protein, omega-3s", use: "Lean & shredded look" },
        { name: "🍳 Egg Whites", nutrients: "Pure protein", use: "Low-fat muscle retention" },
        { name: "🥒 Cucumber + Carrot", nutrients: "Hydration, fiber", use: "Snacking & cutting" },
        { name: "🍏 Apple", nutrients: "Natural sugar, antioxidants", use: "Pre-workout energy" },
        { name: "🥬 Spinach", nutrients: "Iron, fiber", use: "Low-cal nutrition" },
        { name: "🍋 Green Tea", nutrients: "Catechins", use: "Fat burn booster" }
      ]
    }
  },
  female: {
    title: "Fitness Plan for Girls",
    motivation: "You are powerful, you are graceful, and you are strong. Build your strength and confidence each day!",
    routine: [
      "🏃‍♀️ Run 1km every morning",
      "💪 15 pushups × 2 sets",
      "🧘‍♀️ 15 minutes yoga",
      "🚶‍♀️ Evening walk 2km",
      "🪑 Chair squats & light stretching"
    ],
    foods: {
      bulk: [
        { name: "🥜 Almonds + Dates", nutrients: "Iron, protein, energy", use: "Weight & strength gain" },
        { name: "🍚 Paneer & Rice", nutrients: "Protein, calcium, carbs", use: "Mass & bone support" },
        { name: "🥛 Milk with Banana", nutrients: "Energy, potassium", use: "Healthy bulking" },
        { name: "🍠 Sweet Potato", nutrients: "Complex carbs, Vitamin A", use: "Long energy" },
        { name: "🍳 Eggs + Chapati", nutrients: "Protein, fiber, calories", use: "Balanced meal" },
        { name: "🍯 Honey & Milk", nutrients: "Natural sugar, protein", use: "Weight gain" },
        { name: "🥣 Oats + Fruits", nutrients: "Fiber, vitamins", use: "Morning booster" }
      ],
      cut: [
        { name: "🥦 Steamed Broccoli", nutrients: "Low-cal fiber", use: "Fat burning support" },
        { name: "🍋 Lemon Water + Green Tea", nutrients: "Metabolism boost", use: "Morning detox" },
        { name: "🍎 Apple + Peanut Butter", nutrients: "Protein & fiber combo", use: "Satisfying snack" },
        { name: "🥬 Spinach Soup", nutrients: "Iron, low cal", use: "Dinner detox" },
        { name: "🥒 Carrot + Cucumber", nutrients: "Hydrating low cal", use: "Fat-cut snack" },
        { name: "🍓 Berries", nutrients: "Antioxidants, fiber", use: "Anti-inflammatory" },
        { name: "🥤 Herbal Tea", nutrients: "Natural thermogenic", use: "Reduce belly fat" }
      ]
    }
  }
};

export default function FitnessAndFoodsDashboard() {
  const [gender, setGender] = useState("male");
  const [goal, setGoal] = useState("bulk");
  const [timer, setTimer] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.gender === "female") {
      setGender("female");
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (active) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [active]);

  const formatTime = (sec) => `${Math.floor(sec / 60)}:${("0" + (sec % 60)).slice(-2)}`;

  const plan = fitnessPlans[gender];
  const foodList = plan.foods[goal];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-lime-100 pt-20">
      <StuNav />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold text-green-800 mb-4 text-center">
          {plan.title} {gender === "male" ? <BsGenderMale className="inline ml-2" /> : <BsGenderFemale className="inline ml-2" />}
        </h1>

        <p className="text-center italic text-gray-700 text-lg mb-6">💬 {plan.motivation}</p>

        <div className="flex justify-center gap-4 my-6">
          <button
            onClick={() => setGoal("bulk")}
            className={`px-4 py-2 rounded-full font-semibold ${goal === "bulk" ? "bg-green-700 text-white" : "bg-white border border-green-600 text-green-700"}`}
          >
            Bulk
          </button>
          <button
            onClick={() => setGoal("cut")}
            className={`px-4 py-2 rounded-full font-semibold ${goal === "cut" ? "bg-green-700 text-white" : "bg-white border border-green-600 text-green-700"}`}
          >
            Cut
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 bg-green-100 px-6 py-4 rounded-xl mb-10">
          <span className="text-xl font-bold text-green-700">⏱️ Timer:</span>
          <span className="text-xl font-mono text-green-800">{formatTime(timer)}</span>
          <button
            onClick={() => setActive(!active)}
            className="bg-green-600 text-white px-4 py-1 rounded-full"
          >
            {active ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => { setActive(false); setTimer(0); }}
            className="bg-red-500 text-white px-4 py-1 rounded-full"
          >
            Reset
          </button>
        </div>

        <section className="mt-4 mb-12">
          <h2 className="text-2xl font-bold text-green-800 mb-4">📅 Weekly Fitness Plan</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-800">
            {plan.routine.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-800 mb-4">🍽️ {goal === "bulk" ? "Bulking Diet Plan" : "Cutting Diet Plan"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {foodList.map((food, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-4 hover:shadow-lg"
              >
                <h3 className="font-bold text-lg text-green-700">{food.name}</h3>
                <p className="text-sm text-gray-700">{food.nutrients}</p>
                <p className="text-xs text-gray-500 italic">{food.use}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-800 mb-4">💡 How to Do Pushups (Symbol Guide)</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>🔄 Warm-up with stretches</li>
            <li>✋ Place hands shoulder-width apart</li>
            <li>📏 Keep back straight, don't drop hips</li>
            <li>⬇️ Lower yourself slowly</li>
            <li>⬆️ Push up without locking elbows</li>
            <li>🧘‍♀️ Cooldown with deep breathing</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
