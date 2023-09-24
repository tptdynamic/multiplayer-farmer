# tpt-multiplayer-farmer
Deloy: node Node.js

This is old project make by me with fun and study purpose
To make it simple to understand how it work:
  + Render by layers: the client receive 2d integer array of a game map for example: value 1 it mean it take first 16x16 tile and render to canvas
  + Collision mask: an array of a game map to block player movement so player can't move when it meet that block
  + Animation: so there a couple of player sprite and an index to create a stream of sprite
  + Multiplayer: server have data of player and send that infomation to client. Client use that data to tell where is other player is

This project is procedural it not have OOP and Design pattern 
