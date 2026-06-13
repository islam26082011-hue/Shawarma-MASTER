// Импорт цен ингредиентов
import { INGREDIENT_PRICES } from "../constants/prices.js";

// Импорт CSS-модуля
import s from "./TabMarket.module.css";


// Иконки ингредиентов
const ICONS = {
  chicken: "🍗",
  vegetables: "🥬",
  sauce: "🧴"
};

// Названия ингредиентов
const NAMES = {
  chicken: "Мясо",
  vegetables: "Овощи",
  sauce: "Соус"
};

// Максимальное количество одного ингредиента на складе
const MAX = 50;


// Компонент вкладки рынка
export default function TabMarket({
  money,           // текущие деньги игрока
  setMoney,        // функция изменения денег
  ingredients,     // текущие ингредиенты
  setIngredients   // функция изменения ингредиентов
}) {

  // Функция покупки ингредиента
  const buy = (type, qty = 1) => {

    // Цена одного ингредиента
    const price = INGREDIENT_PRICES[type];

    // Сколько этого ингредиента уже есть
    const cur = Number(ingredients[type]) || 0;

    // Сколько реально можно купить
    // чтобы не превысить лимит MAX
    const toBuy = Math.min(qty, MAX - cur);

    // Если склад заполнен
    // или денег недостаточно
    // покупку отменяем
    if (toBuy <= 0 || money < price * toBuy) return;

    // Списываем деньги
    setMoney(prevMoney =>
      prevMoney - price * toBuy
    );

    // Добавляем ингредиенты на склад
    setIngredients(prevIngredients => ({
      ...prevIngredients,

      [type]:
        (Number(prevIngredients[type]) || 0)
        + toBuy
    }));
  };

  return (
    <div className={s.tab}>

      {/* Заголовок вкладки */}
      <h2 className={s.title}>
        Рынок
      </h2>

      {/* Проходим по всем типам ингредиентов */}
      {Object.keys(INGREDIENT_PRICES).map(type => {

        // Текущее количество ингредиента
        const amount =
          Number(ingredients?.[type]) || 0;

        // Процент заполнения склада
        const pct =
          (amount / MAX) * 100;

        // Склад заполнен?
        const isFull =
          amount >= MAX;

        // Цена ингредиента
        const price =
          INGREDIENT_PRICES[type];

        // Хватает ли денег хотя бы на 1 штуку
        const canAfford =
          money >= price;

        return (

          // Карточка ингредиента
          <div
            key={type}
            className={s.item}
          >

            {/* Левая часть карточки */}
            <div className={s.itemLeft}>

              {/* Иконка ингредиента */}
              <span className={s.icon}>
                {ICONS[type]}
              </span>

              <div>

                {/* Название ингредиента */}
                <p className={s.name}>
                  {NAMES[type]}
                </p>

                {/* Полоса заполнения склада */}
                <div className={s.barWrap}>

                  <div className={s.bar}>

                    {/* Цветная часть полосы */}
                    <div
                      className={s.barFill}
                      style={{
                        width: `${pct}%`
                      }}
                    />

                  </div>

                  {/* Текущее количество */}
                  <span className={s.count}>
                    {amount}/{MAX}
                  </span>

                </div>

              </div>
            </div>

            {/* Кнопки покупки */}
            <div className={s.actions}>

              {/* Купить 1 штуку */}
              <button
                className={`
                  ${s.btn}
                  ${isFull ? s.full : ""}
                  ${!canAfford ? s.broke : ""}
                `}
                onClick={() => buy(type, 1)}
                disabled={
                  isFull ||
                  !canAfford
                }
              >
                +1 · {price} с
              </button>

              {/* Купить 5 штук */}
              <button
                className={`
                  ${s.btn}
                  ${
                    isFull ||
                    money < price * 5
                      ? s.broke
                      : ""
                  }
                `}
                onClick={() => buy(type, 5)}
                disabled={
                  isFull ||
                  money < price * 5
                }
              >
                +5 · {price * 5} с
              </button>

            </div>

          </div>
        );
      })}

      {/* Отображение текущего баланса */}
      <div className={s.tip}>
        💰 Баланс:
        <strong>
          {" "}
          {money.toLocaleString()} с
        </strong>
      </div>

    </div>
  );
}