import React from "react";

export default function WhateverTest() {
  const something = [
    "tryA",
    "tryB",
    "tryC"
  ];
  return (
    <div>
      <p>Some bullshit...</p>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi consectetur porro deserunt nisi ex molestiae sapiente qui natus libero tempora sint assumenda placeat nulla laboriosam sit sequi, totam modi id.</p>
      {something.map((n, i) => <span key={i}>{n}</span>)}
    </div>
  )
}