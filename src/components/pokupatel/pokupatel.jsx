import customerImage from '../../assets/sprites/customer.png';

export default function Pokupatel (){
    return(
        // Теперь мы используем переменную, в которой лежит правильная ссылка
        <img src={customerImage} alt="покупатель" />
    )
}