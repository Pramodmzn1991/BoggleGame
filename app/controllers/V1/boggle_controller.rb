require "boggle_board"
require 'enumerator'

class V1::BoggleController < ApplicationController
    def index
        render json: { :boggle => [
            {
                :name => 'Pramod',
                :surname => 'Maharjan'
            }
        ]}.to_json
    end

    def board
        BoggleBoardGenerator.seed = rand(100..999)
        b = BoggleBoardGenerator.new
         
        render json: { :data => b.board, :adjacent => b.adjacent}.to_json
    end

    def evaluate
        word = params[:word];
        puts word;
        response = DICTIONARY.include?(word)

        render json: { :valid => response}.to_json
    end

end
