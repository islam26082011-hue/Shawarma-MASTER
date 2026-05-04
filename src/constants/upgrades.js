// Конфиг уровней (Квесты)
export const LEVEL_REQUIREMENTS = {
    1: { money: 3500, count: 15, title: "Уличный лоток", reward: "Разблокирован соус 'Секрет шефа'" },
    2: { money: 8000, count: 50, title: "Уютный киоск", reward: "Новый вид: Сырная шаурма" },
    3: { money: 10000, count: 120, title: "Мастер точки", reward: "Разблокирован найм помощника" },
    4: { money: 15000, count: 300, title: "Шаурмичный барон", reward: "Гриль 'Vulkan 3000'" },
    5: { money: 25000, count: 700, title: "Бизнесмен", reward: "Новый вид: Веган-ролл" },
    6: { money: 45000, count: 1500, title: "Король района", reward: "Авто-упаковщик" },
    7: { money: 75000, count: 3500, title: "Легенда города", reward: "Франшиза" },
    8: { money: 120000, count: 8000, title: "Шаурма-Империя", reward: "Золотой вертел" },
    9: { money: 250000, count: 20000, title: "Global Shawarma CEO", reward: "Финальный рецепт" }
  };
  
  // Апгрейды (Магазин)
  export const SHOP_UPGRADES = [
    // СКОРОСТЬ (Уменьшение cookingTime)
    {
      id: "fast_knife",
      name: "Острый нож",
      cost: 300,
      type: "speed",
      value: 1000, // Минус 1 секунда
      description: "Нарезка овощей быстрее на 1с",
      minLevel: 1
    },
    {
      id: "turbo_grill",
      name: "Турбо-гриль",
      cost: 2500,
      type: "speed",
      value: 3000, // Минус 3 секунды
      description: "Жарит мясо почти мгновенно",
      minLevel: 3
    },
    
    // ЦЕНА (Увеличение дохода за одну продажу)
    {
      id: "cheese_sauce",
      name: "Сырный соус",
      cost: 800,
      type: "price",
      value: 50, // +50 сом к цене
      description: "Люди обожают сыр! Ваши клиенты будут отдавать на 50 больше за ваш шедевр!",
      minLevel: 2
    },
    {
      id: "premium_meat",
      name: "Мраморная говядина",
      cost: 15000,
      type: "price",
      value: 450, // +450 сом к цене
      description: "Элитная шаурма для богатых",
      minLevel: 5
    },
  
    // АВТОНОМНОСТЬ (Пассивный доход)
    {
      id: "apprentice",
      name: "Стажер",
      cost: 5000,
      type: "idle",
      value: 1, // +1 шаурма каждые 5 секунд
      description: "Сам крутит, пока ты отдыхаешь",
      minLevel: 3
    },
  
    // ЖИРНЫЕ АПГРЕЙДЫ (Эндгейм)
    {
      id: "marketing_campaign",
      name: "Реклама у блогеров",
      cost: 35000,
      type: "multiplier",
      value: 2, // Х2 к деньгам за все продажи
      description: "Очередь за твоей шаурмой на три квартала",
      minLevel: 6
    },
    {
      id: "molecular_kitchen",
      name: "Молекулярный цех",
      cost: 70000, // Твой жирный апгрейд
      type: "price",
      value: 2500, 
      description: "Шаурма со вкусом ностальгии. Стоит целое состояние.",
      minLevel: 8
    }
  ];