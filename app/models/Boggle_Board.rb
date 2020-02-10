
require 'enumerator'

class BoggleBoardGenerator
  BoggleDie = [
    ['f', 'o', 'r', 'i', 'x', 'b'],
    ['m', 'o', 'qu', 'a', 'b', 'j'],
    ['g', 'u', 'r', 'i', 'l', 'w'],
    ['s', 'e', 't', 'u', 'p', 'l'],
    ['c', 'm', 'p', 'd', 'a', 'e'],
    ['a', 'c', 'i', 't', 'a', 'o'],
    ['s', 'l', 'c', 'r', 'a', 'e'],
    ['r', 'o', 'm', 'a', 's', 'h'],
    ['n', 'o', 'd', 'e', 's', 'w'],
    ['h', 'e', 'f', 'i', 'y', 'e'],
    ['o', 'n', 'u', 'd', 't', 'k'],
    ['t', 'e', 'v', 'i', 'g', 'n'],
    ['a', 'n', 'e', 'd', 'v', 'z'],
    ['p', 'i', 'n', 'e', 's', 'h'],
    ['a', 'b', 'i', 'l', 'y', 't'],
    ['g', 'k', 'y', 'l', 'e', 'u']]

  @@random_seed = 10202007

  attr_reader :board
  attr_reader :adjacent
  
  
  def initialize()
    srand @@random_seed  
    indices = (0...BoggleDie.size).to_a.sort_by { rand }
    @@random_seed = rand 2**31 

    @board = BoggleDie.values_at(*indices).map { |die| die[rand(die.size)] }
  end


  def self.seed=(new_seed)
    @@random_seed = new_seed
  end

  def adjacent
    @adjacent = []
    @c = (0..15).each_slice(4).to_a
    for x in 0..3
      for y in 0..3
        adjacentItems = []
        adjacentItems.clear

        if x-1 >= 0 and y-1 >= 0
          adjacentItems = adjacentItems.push(@c[x-1][y-1])
        end
        if x-1 >= 0
          adjacentItems = adjacentItems.push(@c[x-1][y])
        end
        if x-1 >= 0 and y+1 <= 3
          adjacentItems = adjacentItems.push(@c[x-1][y+1])
        end

        if y-1 >= 0
          adjacentItems = adjacentItems.push(@c[x][y-1])
        end
        if y+1 <= 3
          adjacentItems = adjacentItems.push(@c[x][y+1])
        end

        if x+1 <= 3 and y-1 >= 0
          adjacentItems = adjacentItems.push(@c[x+1][y-1])
        end
        if x+1 <= 3
          adjacentItems = adjacentItems.push(@c[x+1][y])
        end
        if x+1 <= 3 and y+1 <= 3
          adjacentItems = adjacentItems.push(@c[x+1][y+1])
        end

        @adjacent = @adjacent.push(adjacentItems)
      end
    end

    @adjacent.to_a
  end
end