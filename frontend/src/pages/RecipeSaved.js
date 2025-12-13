
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSavedRecipes, deleteRecipe, toggleSaveRecipe,} from "../utils/api/recipe";
import Button from "../components/common/Button";
import "./RecipeSaved.css";

const RecipeSaved = () => {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [sortOrder, setSortOrder] = useState('등록순');


  useEffect(() => {
     const load = async () => {
      try {
        const data = await fetchSavedRecipes(); 
        setRecipes(data);
      } catch (e) {
        console.error("보관함 레시피 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);


  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteRecipe(Number(id));    // 백엔드 삭제
      toggleSaveRecipe(Number(id));      // 로컬 스토리지에서도 제거

      setRecipes((prev) => prev.filter((r) => r.id !==(Number(id))));  
    } catch (err) {
      console.error(err);
      alert("레시피 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCardClick = (id) => {
    if (!deleteMode) {
      navigate(`/recipes/${id}`);
    }
  };
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };
 
  const sortedRecipes = recipes.slice().sort((a, b) => {
    if (sortOrder === '이름순') {
        return a.title.localeCompare(b.title); 
    }
     // 등록순
    return new Date(b.created_at || b.id) - new Date(a.created_at || a.id);
});

  return (
    <div className="saved-page">
      <section className="saved-hero">
        <h1>RECIPE</h1>
        <p>레시피 / 보관함</p>
      </section>

      <div className="saved-layout">
        

        {/* 리스트 */}
        <section className="saved-content">
          <div className="saved-toolbar">
            <div className="list-count">
              list <span>{sortedRecipes.length}</span>
            </div>

          <div className="toolbar-right">
            
            <Button
              type="primary"
              size="sm"
              full
              className="saved-delete-btn"
              onClick={() => setDeleteMode(prev => !prev)}
            > 삭제
              </Button>
          
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
              <div key={recipe.id}>
                <div
                  className={`recipe-card ${deleteMode ? "delete-mode" : ""}`}
                  onClick={() => handleCardClick(recipe.id)}
                >
                  <div className="recipe-img-wrap">
                    <img src={recipe.image_url} alt={recipe.title} />
                  </div>
                  <div className="recipe-title">{recipe.title}</div>
                </div>

                {deleteMode && (
                  <Button
                    type="primary"
                    size="sm"
                    full
                    className="delete-btn"

                    onClick={(e) => handleDelete(recipe.id, e)}
                  > 삭제
                  </Button>
                )}
              </div>
            ))}
            {sortedRecipes.length === 0 && !loading && (
              <div className="empty"> 저장된 레시피가 없습니다.</div>
            )}
            
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecipeSaved;
 

