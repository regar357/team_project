
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSavedRecipes, deleteRecipe } from "../utils/api/recipe";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import "./RecipeSaved.css";

const CATEGORIES = ["한식", "양식", "중식", "디저트", "기타"];

const RecipeSaved = () => {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([...CATEGORIES]);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [sortOrder, setSortOrder] = useState('등록순');


  useEffect(() => {
    fetchSavedRecipes()
      .then((data) => {
        setRecipes(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };
  const filteredRecipes = recipes.filter((r) =>
    selectedCategories.includes(r.category)
  );
  const sortedRecipes = filteredRecipes.slice().sort((a, b) => {
    if (sortOrder === '이름순') {
      return a.title.localeCompare(b.title); 
    }
    return 0; 
  });

  if (loading) {
    return <div className="saved-page">불러오는 중...</div>;
  }

  return (
    <div className="saved-page">
      <section className="saved-hero">
        <h1>RECIPE</h1>
        <p>레시피 / 보관함</p>
      </section>

      <div className="saved-layout">
        {/* 왼쪽 필터 */}
        <aside className="filter-panel">
          <h3 className="filter-title">Filter<br />Options</h3>
          <div className="filter-subtitle">By Categories</div>

          <ul className="filter-list">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span>{cat}</span>
                </label>
              </li>
            ))}
          </ul>
        </aside>

        {/* 오른쪽 리스트 */}
        <section className="saved-content">
          <div className="saved-toolbar">
            <div className="list-count">
              list <span>{sortedRecipes.length}</span>
            </div>

          <div className="toolbar-right">
            <button 
              className="icon-btn"
              onClick={() => setDeleteMode(prev => !prev)}
            > 🗑 </button>
          
            <select 
              className="sort-select"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="등록순">등록순</option>
              <option value="이름순">이름순</option>
              </select>
          </div>
          </div>

          <div className="recipe-grid">
            {sortedRecipes.map((recipe) => (
              <Card key={recipe.id}>
                <div
                  className="recipe-card"
                  onClick={() => handleCardClick(recipe.id)}
                >
                  <div className="recipe-img-wrap">
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="recipe-img"
                    />
                  </div>
                  <div className="recipe-title">{recipe.title}</div>
                </div>

                {deleteMode && (
                  <Button
                    type="primary"
                    size="sm"
                    full
                    onClick={(e) => handleDelete(recipe.id, e)}
                  > 삭제
                  </Button>
                )}
              </Card>
            ))}

            {filteredRecipes.length === 0 && (
              <div className="empty">
                선택한 카테고리에 저장된 레시피가 없습니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecipeSaved;
 

