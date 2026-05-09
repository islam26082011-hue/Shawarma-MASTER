export const menuData = [
  {
    id: 1,
    name: "Классическая шаурма",
    price: 200,
    recipe: { chicken: 1, vegetables: 1, sauce: 1 },
    description: "Курица, капуста, огурцы, помидоры, фирменный соус."
  },
  {
    id: 2,
    name: "Сырная шаурма",
    price: 180,
    recipe: { chicken: 1, vegetables: 0, sauce: 2 }, // Сырную считаем через соус или добавь 'cheese'
    description: "Много сыра, сырный соус и хрустящий лаваш."
  },
  {
    id: 3,
    name: "Острая (Диабло)",
    price: 280,
    recipe: { chicken: 1, vegetables: 1, sauce: 2 },
    description: "Перец халапеньо, острый соус и маринованный лук."
  },
  {
    id: 4,
    name: "Вегетарианская",
    price: 130,
    recipe: { chicken: 0, vegetables: 3, sauce: 1 },
    description: "Много овощей, без мяса, с фалафелем."
  },
  {
    id: 5,
    name: "Царская (XXL)",
    price: 370,
    recipe: { chicken: 3, vegetables: 2, sauce: 2 },
    description: "Двойная порция мяса, картофель фри внутри, огромный размер."
  }
];