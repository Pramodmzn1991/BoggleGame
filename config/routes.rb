Rails.application.routes.draw do
  namespace :v1, defaults: { format: 'json'} do
    get 'boggle', to: 'boggle#index'
    get 'boggle/board', to: 'boggle#board'
    get 'boggle/evaluate', to: 'boggle#evaluate'
  end

  get '*page', to: 'home#index', constraints: ->(req) do
    !req.xhr? && req.format.html?
  end
  root 'home#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
