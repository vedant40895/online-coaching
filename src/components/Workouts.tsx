import { useEffect, useState } from 'react';
import { supabase, type Workout } from '../lib/supabase';

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section id="workouts" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Loading workouts...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="workouts" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title text-gray-900">Featured Workouts</h2>
          <p className="section-subtitle">
            Expert-designed workout routines for all fitness levels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={workout.image_url}
                  alt={workout.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`${getDifficultyColor(
                      workout.difficulty
                    )} px-3 py-1 rounded-full text-xs font-semibold uppercase`}
                  >
                    {workout.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {workout.duration_minutes} min
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{workout.name}</h3>
                <p className="text-gray-600 mb-4">{workout.description}</p>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Target Muscles:</div>
                  <div className="flex flex-wrap gap-2">
                    {workout.target_muscles.map((muscle, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Equipment:</div>
                  <div className="flex flex-wrap gap-2">
                    {workout.equipment_needed.map((equipment, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs"
                      >
                        {equipment}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
