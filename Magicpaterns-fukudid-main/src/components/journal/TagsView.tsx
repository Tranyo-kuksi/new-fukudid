import React from "react";
import { HashIcon } from "lucide-react";
export const TagsView = () => {
  const popularTags = [{
    name: "school",
    count: 23,
    color: "bg-blue-100 text-blue-600"
  }, {
    name: "friends",
    count: 18,
    color: "bg-green-100 text-green-600"
  }, {
    name: "music",
    count: 15,
    color: "bg-purple-100 text-purple-600"
  }, {
    name: "family",
    count: 12,
    color: "bg-yellow-100 text-yellow-600"
  }, {
    name: "crush",
    count: 10,
    color: "bg-pink-100 text-pink-600"
  }, {
    name: "movies",
    count: 8,
    color: "bg-indigo-100 text-indigo-600"
  }, {
    name: "sports",
    count: 7,
    color: "bg-red-100 text-red-600"
  }, {
    name: "books",
    count: 6,
    color: "bg-emerald-100 text-emerald-600"
  }, {
    name: "gaming",
    count: 5,
    color: "bg-cyan-100 text-cyan-600"
  }, {
    name: "travel",
    count: 4,
    color: "bg-amber-100 text-amber-600"
  }, {
    name: "food",
    count: 4,
    color: "bg-lime-100 text-lime-600"
  }, {
    name: "art",
    count: 3,
    color: "bg-fuchsia-100 text-fuchsia-600"
  }];
  return <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HashIcon size={24} className="text-purple-600 mr-2" />
        <h2 className="text-2xl font-bold text-purple-800">Tags</h2>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-3">
          {popularTags.map(tag => <div key={tag.name} className={`${tag.color} px-4 py-2 rounded-full flex items-center cursor-pointer hover:opacity-90 transition-opacity`}>
              <span className="font-medium">#{tag.name}</span>
              <span className="ml-2 bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-xs">
                {tag.count}
              </span>
            </div>)}
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Recent Tagged Entries
        </h3>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-400 pl-4 py-1">
            <div className="flex items-center">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                #school
              </span>
              <span className="text-xs text-gray-500 ml-2">May 12, 2023</span>
            </div>
            <p className="text-gray-700 mt-1 line-clamp-2">
              Finals week is coming up and I'm so stressed! Need to study for
              math and science...
            </p>
          </div>
          <div className="border-l-4 border-pink-400 pl-4 py-1">
            <div className="flex items-center">
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                #crush
              </span>
              <span className="text-xs text-gray-500 ml-2">May 10, 2023</span>
            </div>
            <p className="text-gray-700 mt-1 line-clamp-2">
              OMG! Alex actually talked to me today during lunch. I was so
              nervous I could barely speak...
            </p>
          </div>
          <div className="border-l-4 border-green-400 pl-4 py-1">
            <div className="flex items-center">
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                #friends
              </span>
              <span className="text-xs text-gray-500 ml-2">May 8, 2023</span>
            </div>
            <p className="text-gray-700 mt-1 line-clamp-2">
              Had the best time at the mall with Emma and Sophia. We tried on so
              many outfits and took funny pics...
            </p>
          </div>
        </div>
      </div>
    </div>;
};