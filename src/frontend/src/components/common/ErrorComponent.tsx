import React from 'react';

export default function ErrorComponent(props: { error: Error }) {
  console.error(props.error);
  return <div>An error has occurred</div>;
}
