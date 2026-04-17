import './Advertisement.css';

function Advertisement() {
  return (
    <>
      <div className="header-controls">
        <div className="segmented-control">
            <button className="segment active">Потерянные</button>
            <button className="segment">Найденные</button>
        </div>
        <button className="filter-btn">
            <svg>...</svg> 
            Фильтры
        </button>
      </div>
    </>
  );
};

export { Advertisement };