{-# LANGUAGE DeriveGeneric     #-}
{-# LANGUAGE OverloadedStrings #-}

module Api.Model where

import GHC.Generics (Generic)
import Data.Aeson   (ToJSON, FromJSON)
import Data.Text    (Text)
import Data.Maybe   (listToMaybe)

import Database.PostgreSQL.Simple
  ( Connection
  , Only(..)
  , execute
  , execute_
  , query
  , query_
  )
import Database.PostgreSQL.Simple.FromRow (FromRow(..), field)

-- ===========================
--  MODELOS / JSON
-- ===========================

-- Receita completa (vem do banco)
data Recipe = Recipe
  { recipeId        :: Int
  , title           :: Text
  , category        :: Maybe Text
  , cookTimeMinutes :: Maybe Int
  , difficulty      :: Maybe Text
  , rating          :: Maybe Int
  , instructions    :: Maybe Text
  } deriving (Show, Generic)

instance FromJSON Recipe where
instance ToJSON   Recipe where

instance FromRow Recipe where
  fromRow = Recipe
    <$> field
    <*> field
    <*> field
    <*> field
    <*> field
    <*> field
    <*> field

-- Dados enviados pelo front para criar/editar receita
data RecipeInput = RecipeInput
  { titleInput           :: Text
  , categoryInput        :: Maybe Text
  , cookTimeMinutesInput :: Maybe Int
  , difficultyInput      :: Maybe Text
  , ratingInput          :: Maybe Int
  , instructionsInput    :: Maybe Text
  } deriving (Show, Generic)

instance FromJSON RecipeInput where
instance ToJSON   RecipeInput where

-- Resposta com lista de receitas (estilo ClienteResponse)
data RecipeListResponse = RecipeListResponse
  { recipes :: [Recipe]
  } deriving (Show, Generic)

instance ToJSON RecipeListResponse where

-- ===========================
--  FUNÇÕES DE BANCO
-- ===========================

initDB :: Connection -> IO ()
initDB conn = do
  _ <- execute_ conn
    "CREATE TABLE IF NOT EXISTS recipes ( \
    \  id SERIAL PRIMARY KEY, \
    \  title TEXT NOT NULL, \
    \  category TEXT, \
    \  cook_time_minutes INT, \
    \  difficulty TEXT, \
    \  rating INT CHECK (rating BETWEEN 0 AND 5), \
    \  instructions TEXT \
    \)"
  pure ()

getAllRecipes :: Connection -> IO [Recipe]
getAllRecipes conn =
  query_ conn
    "SELECT id, title, category, cook_time_minutes, difficulty, rating, instructions \
    \FROM recipes ORDER BY id"

getRecipeById :: Connection -> Int -> IO (Maybe Recipe)
getRecipeById conn rid = do
  rs <- query conn
          "SELECT id, title, category, cook_time_minutes, difficulty, rating, instructions \
          \FROM recipes WHERE id = ?" (Only rid)
  pure (listToMaybe rs)

createRecipe :: Connection -> RecipeInput -> IO Recipe
createRecipe conn input = do
  [r] <- query conn
    "INSERT INTO recipes \
    \(title, category, cook_time_minutes, difficulty, rating, instructions) \
    \VALUES (?,?,?,?,?,?) \
    \RETURNING id, title, category, cook_time_minutes, difficulty, rating, instructions"
    ( titleInput           input
    , categoryInput        input
    , cookTimeMinutesInput input
    , difficultyInput      input
    , ratingInput          input
    , instructionsInput    input
    )
  pure r

updateRecipe :: Connection -> Int -> RecipeInput -> IO (Maybe Recipe)
updateRecipe conn rid input = do
  rs <- query conn
    "UPDATE recipes \
    \SET title = ?, category = ?, cook_time_minutes = ?, \
    \    difficulty = ?, rating = ?, instructions = ? \
    \WHERE id = ? \
    \RETURNING id, title, category, cook_time_minutes, difficulty, rating, instructions"
    ( titleInput           input
    , categoryInput        input
    , cookTimeMinutesInput input
    , difficultyInput      input
    , ratingInput          input
    , instructionsInput    input
    , rid
    )
  pure (listToMaybe rs)

deleteRecipe :: Connection -> Int -> IO ()
deleteRecipe conn rid = do
  _ <- execute conn "DELETE FROM recipes WHERE id = ?" (Only rid)
  pure ()
