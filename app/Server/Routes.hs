{-# LANGUAGE DataKinds     #-}
{-# LANGUAGE TypeOperators #-}

module Server.Routes
  ( API
  , api
  , server
  ) where

import Servant
import Control.Monad.IO.Class (liftIO)
import Database.PostgreSQL.Simple (Connection)

import Api.Model

type API =
       "recipes" :> Get '[JSON] [Recipe]
  :<|> "recipes" :> ReqBody '[JSON] RecipeInput :> PostCreated '[JSON] Recipe
  :<|> "recipes" :> Capture "id" Int :> Get '[JSON] Recipe
  :<|> "recipes" :> Capture "id" Int :> ReqBody '[JSON] RecipeInput :> Put '[JSON] Recipe
  :<|> "recipes" :> Capture "id" Int :> Delete '[JSON] NoContent



api :: Proxy API
api = Proxy

server :: Connection -> Server API
server conn =
       listH
  :<|> createH
  :<|> getH
  :<|> updateH
  :<|> deleteH
  where
    listH :: Handler [Recipe]
    listH = liftIO $ getAllRecipes conn

    createH :: RecipeInput -> Handler Recipe
    createH input = liftIO $ createRecipe conn input

    getH :: Int -> Handler Recipe
    getH rid = do
      m <- liftIO $ getRecipeById conn rid
      case m of
        Just r  -> pure r
        Nothing -> throwError err404

    updateH :: Int -> RecipeInput -> Handler Recipe
    updateH rid input = do
      m <- liftIO $ updateRecipe conn rid input
      case m of
        Just r  -> pure r
        Nothing -> throwError err404

    deleteH :: Int -> Handler NoContent
    deleteH rid = do
      liftIO $ deleteRecipe conn rid
      pure NoContent
