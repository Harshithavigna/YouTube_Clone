const categories = [
  "All",
  "Music",
  "Gaming",
  "Education",
  "Sports",
  "News",
  "Entertainment",
  "Technology",
];

const FilterButtons = ({ activeCategory, onSelect }) => {
  return (
    <div className="filter-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;