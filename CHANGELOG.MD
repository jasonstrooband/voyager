# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.1.6] - 2018-11-19
### Added
- Change log file for recording changes made and version releases
- Added a simple pre-loader back in
- Added a star data file for storing base information for certain star types
- Added more in depth star classification and using the base star properties from starData file
- Added RGBTo Hex function to add in star colours

### Changed
- Changed the way debug is displayed with styling options
- Changed debugging to only display if the debug flag is set to true
- Changed the way star information is added to the ui with full star properties

### Fixes
- Changed the names of generation functions to remove clashes with the variables the data is stored in
- Fixed class method calls for static methods
- Fixed dice roll function to floor the number as it was producing a float and not an integer
- Fixed system panel tree and details not switching correctly

## [0.1.5] - 2017-02-09
### Added
- Added the Body class which is used to create the system bodies
  + Only used for stars currently
- Generates the primary star classification for every system in the sector
- Created the preliminary data structure for storing a system heirarchy
- Beginning of a possible second star in some systems
- Created a tree menu to display system bodies
- Clicking on a tree menu item will display system body information related to what was clicked on
  + Root tree node displays Number of Stars and Primary Star Classification
  + Displays only name on non root objcts
- Code review / cleanup

### Changed
- Moved sytem array out of the hexes array to its own variable with the hexId
- Converted all css files into scss for a modular style approach
- Moved the system class instancer into the Sector class

### Removed
- Removed the preloader for now, needs a batter replacement

## [0.1.0] - 2017-02-05
### Added
- Generates Details for a random Galaxy
  + Galaxy Classification
  + Sector location in Galaxy
  + Sector location in Cluster
- Generates a Sector as a hexagonal map
  + 8x10 Grid size
- Generates a number of Stars and places them on gridpoints of the Hex map
  + Only the name is generated

### Changed
- Renamed the project to Voyager - previously StarGen
  + StarGen was already in use and I wanted a more unique name
- Added class instance global variables to reduce code replication