import Card from './Card.tsx';
import { Component } from 'react';

interface Item {
  name: string;
  description: string;
}

interface CardListProps {
  items: Item[];
}

class CardList extends Component<CardListProps> {
  render() {
    if (this.props.items.length === 0) {
      return <div>No results found.</div>;
    }
    return (
      <div>
        {this.props.items.map((item) => (
          <Card
            key={item.name}
            name={item.name}
            description={item.description}
          />
        ))}
      </div>
    );
  }
}

export default CardList;
