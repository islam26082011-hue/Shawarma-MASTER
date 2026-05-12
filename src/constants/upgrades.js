// Конфиг уровней (Квесты)
export const LEVEL_REQUIREMENTS = {
    1: { money: 3500, count: 15, title: "Уличный лоток", reward: "Разблокирована Классическая шаурма" },
    2: { money: 8000, count: 50, title: "Уютный киоск", reward: "Разблокирована Сырная шаурма" },
    3: { money: 10000, count: 120, title: "Мастер точки", reward: "Разблокирована Острая шаурма (Диабло)" },
    4: { money: 15000, count: 300, title: "Шаурмичный барон", reward: "Разблокирована Вегетарианская шаурма" },
    5: { money: 25000, count: 700, title: "Бизнесмен", reward: "Разблокирована Царская (XXL) шаурма" },
    6: { money: 45000, count: 1500, title: "Король района", reward: "Разблокирован апгрейд 'Мраморная говядина'" },
    7: { money: 75000, count: 3500, title: "Легенда города", reward: "Разблокирована Super mix & Мастер Super mix" },
    8: { money: 120000, count: 8000, title: "Шаурма-Империя", reward: "Эндгейм апгрейды разблокированы" },
    9: { money: 250000, count: 20000, title: "Global Shawarma CEO", reward: "✨ Ты покорил мир шауармы!" }
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
      value: 500, // 500 сом каждые 15 секунд
      description: "Работает в твоей лавке. Каждые 15 секунд приносит 500 сом.",
      minLevel: 3
    },
    {
      id: "super_mix_master",
      name: "Мастер Super mix",
      cost: 25000,
      type: "idle_super",
      value: 6, // Производит Super mix (id: 6)
      description: "Мастер-шефа, знает только Super mix. Производит за 500 сом каждые 3 секунды.",
      minLevel: 7
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