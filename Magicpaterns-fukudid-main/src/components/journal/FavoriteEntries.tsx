import React, { memo } from "react";
import { StarIcon } from "lucide-react";
export const FavoriteEntries = () => {
  return <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <StarIcon size={24} className="text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-purple-800">Favorite Entries</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(id => <div key={id} className="bg-white rounded-xl p-5 shadow-sm border border-purple-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm text-gray-500">
                April {id + 10}, 2023
              </span>
              <StarIcon size={16} className="text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-gray-700 line-clamp-3">
              This was such a memorable day! I'll never forget how it felt when
              we all gathered at the beach to watch the sunset...
            </p>
          </div>)}
      </div>
      <div className="flex justify-center mt-8">
        <button className="px-4 py-2 text-purple-600 hover:text-purple-800 font-medium">
          See All Favorites
        </button>
      </div>
    </div>;
};