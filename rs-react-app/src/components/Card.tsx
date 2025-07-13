import { Component } from 'react';

interface CardProps {
  name: string;
  description: string;
}

class Card extends Component<CardProps> {
  render() {
    return (
      <div className="border rounded shadow p-4 bg-white mb-2">
        <div className="font-bold capitalize">{this.props.name}</div>
        <div>{this.props.description}</div>
      </div>
    );
  }
}

export default Card;
