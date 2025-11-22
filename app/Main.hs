{-# LANGUAGE OverloadedStrings #-}

module Main where

import Network.Wai (Application)
import Network.Wai.Handler.Warp
  ( runSettings
  , defaultSettings
  , setPort
  , setHost
  )
import Network.Wai.Middleware.Cors
  ( cors
  , corsMethods
  , corsRequestHeaders
  , simpleCorsResourcePolicy
  )
import Servant
import Database.PostgreSQL.Simple

import Server.Routes (API, api, server)
import Api.Model     (initDB)

app :: Connection -> Application
app conn = serve api (server conn)

-- Wrap com CORS
withCors :: Application -> Application
withCors =
  cors (const $ Just policy)
  where
    policy = simpleCorsResourcePolicy
      { corsRequestHeaders = ["Content-Type"]
      , corsMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
      }

main :: IO ()
main = do
  let connStr =
        "host=localhost port=5432 dbname=recipes_db user=postgres password=postgres"
  conn <- connectPostgreSQL connStr
  initDB conn

  putStrLn "Servidor rodando na porta 8080 (CORS habilitado!)"

  let settings =
        setPort 8080 $
        setHost "*4" defaultSettings

  runSettings settings (withCors (app conn))
