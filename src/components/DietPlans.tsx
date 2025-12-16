import { useEffect, useState } from 'react';
import { supabase, type DietPlan } from '../lib/supabase';

export default function DietPlans() {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDietPlans(data || []);
    } catch (error) {
      console.error('Error fetching diet plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'weight_loss':
        return '🔥';
      case 'muscle_gain':
        return '💪';
      case 'maintenance':
        return '⚖️';
      case 'general_health':
        return '🥗';
      default:
        return '🎯';
    }
  };

  if (loading) {
    return (
      <section id="nutrition" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Loading diet plans...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="nutrition" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title text-gray-900">Nutrition Plans</h2>
          <p className="section-subtitle">
            Scientifically-backed nutrition strategies to fuel your transformation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dietPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white">
                <div className="text-4xl mb-3">{getGoalIcon(plan.goal)}</div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-primary-100">{plan.description}</p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 font-medium">Daily Calories</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {plan.calories_per_day}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Macros</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Protein</span>
                      <span className="font-semibold text-gray-900">{plan.macros.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Carbs</span>
                      <span className="font-semibold text-gray-900">{plan.macros.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fats</span>
                      <span className="font-semibold text-gray-900">{plan.macros.fats}g</span>
                    </div>
                  </div>
                </div>

                {plan.restrictions.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Dietary Options</div>
                    <div className="flex flex-wrap gap-2">
                      {plan.restrictions.map((restriction, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Sample Meals</div>
                  <ul className="space-y-1">
                    {plan.meal_plan.slice(0, 3).map((meal, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        {meal.meal}: {meal.foods[0]}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full bg-primary-600 hover:bg-primary-700 text-black font-semibold py-3 rounded-lg transition-colors">
                  Get This Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
