FORMAT : 2A
HOST : https://samplefood2.azurewebsites.net

# FoodConnecterAPI

# POST /api/users

# 認証後ユーザをサーバに登録する。

#### 処理概要

* idはgoogleloginで得たIDを入力、usernameは固有のユーザ名
* cityは在住の市町村を入力
* id,usernameが未登録の場合は新規登録、登録済みの場合はpref、cityを上書きする
* ユーザがはじめてアプリを使うときに必ず呼ぶ

+ Request (application/json)

    {
        "id": "abcdef", (string, required) -- 認証で得たid
        "username": "abc123", (string, required) -- 認証後にユーザが設定したユーザ名
        "city": "豊田市", (string,required) --ユーザが住む市町村の名前
        "pref": "愛知県" (string,optional) --ユーザが住む都道府県の名前
    }

+ Response 200 (application/json)

        [
            {
                "msg":"success"
            }
        ]

+ Response 200 (application/json)

        [
            {
                "status":{err出力} -- 重複など
            }
        ]

# GET /api/view?id=hogehoge&city=xcity

# 地域で投稿された食品情報を表示する。

#### 処理概要

* image_urlに期限内の食材のurlを返す。
* foodに食べ物の種類を返す。
* infoに食べ物の特徴を返す。
* fooddateにその食べ物の期限を返す。
* userid、cityが必須
* cityは変更可能

+ Parameters

    + id: hogehoge (string,require) -- 利用者のアカウントのid
    + city: 豊田市 (string,require) -- 住んでいる市町村名

+ Response 200 (application/json)
    [
        {
            "id": "hogehoge", -- viewのidパラメータ
            "username" : "satou", -- 投稿した人のユーザ名
            "food":"玉ねぎ", -- 投稿された食べ物
            "image_url" :"https://hogehoge.hoge" -- 食べ物のurl
            "info":"3個あります" -- 食べ物のurl
            "fooddate":"2018-08-25T23:36:32.293Z" -- 食べ物の有効期限
            "foodnum":7 -- 投稿された食べ物の管理番号で、api/feedで使う
        }
    ]


+ Response 200 (application/json) --なにも食品が投稿されていないとき

        [
            {
                "msg" : "nothing"
            }
        ]

+ Response 200 (application/json) --idや市町村名がurlに追加されていないとき

    [
        {
            "status" : "Error"
        }
    ]






# POST /api/photopost

# 食品投稿の際はじめに行う。

#### 処理概要
*写真を送るとfoodnumが取得できる。

+ Request (binary)

    カメラで撮った食品画像

+ Response 200 (application/json)

        [
            {
                "foodnum": 6 --管理番号でfoodpostで使う
            }
        ]



# POST /api/foodpost

# 地域のページに投稿する。photopostの後に行う。

#### 処理概要
* userIdとfood、撮影日は必須。useridは認証で帰ってきたidを用いる
* 食材が古いと判断するとエラー。
* ユーザ情報がない場合エラー。

+ Request (application/json)

    {
        "userid":"userid", (string,require)
        "food":"玉ねぎ", (string,require)
        "fooddate":"2018-08-11 23:59:59", (string,require) -- 食品管理開始日
        "info":"書き込む情報", (string,require)
        "foodnum":7, (int,require) -- 食品管理番号(photopostで受け取る)
    }

+ Response 200 (application/json)

        [
            {
                "msg":"succeed"
            }
        ]

+ Response 400 (application/json)

        [
            {
                "status":"Error"
            }
        ]





# POST /api/foodlearn

# 食品を識別する。
##（出力はVisual Recognitionから）

#### 処理概要

* 写真を送るとVisualRecognitionが識別する。

+ Request (binary)

    カメラで撮った食品画像

+ Response 200(application/json)

        {
            "images": [
                {
                    "classifiers": [
                        {
                            "classifier_id": "default",
                            "name": "default",
                            "classes": [
                                {
                                    "class": "onion",
                                    "score": 0.938,
                                    "type_hierarchy": "/nature/onion"
                                },
                                {
                                    "class": "nature",
                                    "score": 0.883
                                }
                            ]
                        }
                    ],
                "image": "uvRIRIzKjm1535433960978onion.jpg"
                }
            ],
            "images_processed": 1,
            "custom_classes": 0
        }

# POST /api/cancel_get_food

# 食べ物受け取り申請キャンセル

#### 処理概要

* googleloginで取得したuseridとおすそ分けする食べ物のfoodnumを入力すると受け取り申請をキャンセルすることができます。

+ Request (application/json)

    {
        "id":"hogehoge",
        "foodnum": "玉ねぎ"
    }

+ Response 200 (application/json)

    {
        "msg":"succeed"
    }

+ Response 400 (application/json)

    {
        "msg":"error_msg"
    }

# GET /api/feed?id&num

# 食べ物の受け取り申請

#### 処理概要

* 人のuseridと、おすそ分けする食べ物の番号を入力すると、受け取りを申請することができます。

+ Parameters

    + id: fjaocunof (string,require) -- アカウントのid
    + num: 8 (int,require) -- 申請する食べ物の番号

+ Response 200 (application/json)

    [
        {
            "msg": "succeed" --成功
        }
    ]

+ Response 200 (application/json)

    [
        {
            "status":"Error" --失敗
        }
    ]

# GET /api/feedlist?id

# 食品のおすそ分け相手を表示する

#### 処理概要

* おすそ分け投稿をした人が使う
* idはGoogleloginで取得したもの

+ Parameters
    + id: fjaocunof (string,require) -- おすそ分け投稿をした人のid

+ Response 200 (application/json)

    [
        {
            "username" : "satou", -- おすそ分け相手のユーザー名
            "food":"玉ねぎ", -- 食べ物の名前
            "foodnum":7 -- 投稿された食べ物の管理番号で、api/feedで使う
        }
    ]

# POST /api/receivefood

# 食品の受け取り完了

#### 処理概要

* おすそ分け機能
* 受け取り手が食品を受け取ったことを確認する
* idはgoogleloginで取得しid、foodnumは、食品の管理番号

+ Request (application/json)

    {
        "id": "abcdef", (string, required) -- id
        "foodnum": 356 (int, require) -- 食品管理番号
    }

+ Response 200 (application/json)


    {
        "msg":"success"
    }



# POST /api/makeevent

# イベントを登録する。

#### 処理概要

* イベント開催者が使う機能
* idは開催者のgoogleloginで得たIDを入力
* cityはイベントを開きたい市町村名
* eventnameは開催者がイベント名を設定したものを入力する
* placeは○○公園など開催する場所の詳細を入力する

+ Request (application/json)

    {
        "id": "abcdef", (string, required) -- イベント開催者のid
        "eventname": "K町バーベキュー大会", (string, required) -- 開催するイベント名
        "pref": "愛知県", (string,required) -- 開催する県名
        "city": "蒲郡市", (string,required) -- 開催する市町村名
        "place": "○○海岸", (string,optional) -- 開催する場所の詳細
        "eventdate": '2018-08-11 23:59:59' (datatime,require) -- 開催する日時
    }

+ Response 200 (application/json)

        [
            {
                "msg":"success"
            }
        ]

+ Response 200 (application/json)

        [
            {
                "status":{err出力}
            }
        ]

# GET /api/myeventlist?id=

# 自分が開催したイベントリストを表示する。

#### 処理概要

* イベント管理者が使う機能
* idは認証時に取得したuserid

+ Parameters

    + id: cjoaun (string,require)

+ Response 200 (application/json)

    [
        {
            "eventname":"○○公園バーベキュー大会",  -- イベント名
            "eventnum": 432, -- イベント管理番号
            "eventdate": "2018-10-15 17:22:00" -- 開催時刻
        },
        {
            "eventname":"△",
            "eventnum": 456,
            "eventdate": "2018-12-01 13:30:00"
        }
    ]

# GET /api/manageevent?id=&eventnum=

# 開催するイベントを管理する。

#### 処理概要

* イベント管理者が使う機能
* eventnumはイベントの管理番号

+ Parameters

    + id: cjoaun (string,require) -- イベント開催者のuserid
    + eventnum: 432 (int,require) -- イベントの管理番号

+ Response 200 (application/json)

        [
            {
                "eventname": "○○公園バーベキュー大会",  -- 開催するイベントの名前
                "eventplace":"X公園",
                "eventcity":"○○市",
                "date": '2018-08-11 15:59:59',  --　開催する日時

                "menbers" :{
                    {
                        "id": 3,
                        "username": "taro"
                    },
                    {
                        "id": 35,
                        "username": "hanako"
                    }
                } -- 参加するメンバー
                "food":{
                    {
                        "username":"taro",
                        "foodname":"キャベツ"
                    },
                    {
                        "username":"hanako",
                        "foodname":"レタス"
                    }
                } -- 集まった食べ物
                "wanted":{
                    {
                        "foodname":"キャベツ"
                    },
                    {
                        "foodname":"豚肉"
                    }
                } -- 欲しい食べ物
            }
        ]

+ Response 200 (application/json)

        [
            {
                "status":{err出力}
            }
        ]


# POST /api/joinevent

# イベントに参加する。

#### 処理概要

* イベント参加者が使う機能
* idは開催者のgoogleloginで得たIDを入力
* eventnumはイベント管理番号

+ Request (application/json)

    {
        "id": "abcdef", (string, required) -- イベント参加者のid
        "eventnum": 356 (int, require) -- イベント管理番号
    }

+ Response 200 (application/json)

        [
            {
                "msg":"success"
            }
        ]

+ Response 200 (application/json)

        [
            {
                "status":{err出力}
            }
        ]


# GET /api/detailevent?eventnum=

# 開催するイベントの詳細情報を閲覧する。

#### 処理概要

* イベント参加者が使う機能
* eventnumはイベントの管理番号

+ Parameters

    + eventnum: 432 (string,require) -- イベントの管理番号

+ Response 200 (application/json)

        [
            {
                "eventname": "○○公園バーベキュー大会"  -- 開催するイベントの名前
                "date": '2018-08-11 15:59:59'  --　開催する日時
                "food":{
                    {
                        "username":"taro",
                        "foodname":"キャベツ"
                    },
                    {
                        "username":"hanako",
                        "foodname":"レタス"
                    }
                } -- 集まった食べ物
                "wanted":{
                    {
                        "foodname":"キャベツ"
                    },
                    {
                        "foodname":"豚肉"
                    }
                } -- 欲しい食べ物
            }
        ]

+ Response 200 (application/json)

        [
            {
                "status":{err出力}
            }
        ]

# POST /api/gatherevent

# イベントに食品を提供する

#### 処理概要
* イベント参加者など
* useridは認証で帰ってきたidを用いる
* ユーザ情報がない場合エラー。

+ Request (application/json)

    {
        "id": "abcdef", (string, required) -- イベント参加者のid
        "eventnum": 356, (int, require) -- イベント管理番号
        "food":"玉ねぎ" (string, require) -- 食べ物の名前
    }

+ Response 200 (application/json)

        [
            {
                "msg":"succeed"
            }
        ]

+ Response 200 (application/json)

        [
            {
                "status":"Error"
            }
        ]

# POST /api/eventwanted

# イベントの食品の募集を投稿する

#### 処理概要

* イベント開催者が使う機能
* eventnumはイベントの管理番号

+ Request (application/json)

    {
        "id": "abcdef", (string, required) -- イベント管理者のid
        "eventnum": 356 (int, require) -- イベント管理番号
        "food": "リンゴ", (string,require) -- 食品の名称
    }


+ Response 200 (application/json)


            {
                "msg": "succeed"
            }


+ Response 200 (application/json)


            {
                "status":{err出力}
            }


# DELETE /api/deletewanted?id=userid&foodname=玉ねぎ&eventnum=2

# イベントの欲しいものリストの食品を取り消す

#### 処理概要

* foodnameに食品の名前
* idにloginで取得したid
* eventnumにイベント管理番号

+ Parameters

    + id: abcdef (string,require) -- userid
    + foodname: 玉ねぎ (string,require) -- 食べ物の名前
    + eventnum:2 -- イベント管理番号

+ Response (200)

+ Response (400)



# GET /api/eventview?pref=

# イベントの一覧表示

#### 処理概要

* イベント参加者が使う機能
* eventnumはイベントの管理番号

+ Parameters

    + pref: 愛知県 (string,require) -- 表示する県

+ Response 200 (application/json)

        [
            {
                "num": 2, -- イベント番号
                "eventname": "○○公園バーベキュー大会", -- イベント名
                "city": "○○市", -- 開催する市町村
                "place": "△公園" -- 場所
            }
        ]

+ Response 200 (application/json)

        [
            {
                "status":{err出力}
            }
        ]

# GET /api/getchat?user=username&touser=username2

# おすそわけチャット履歴取得用

#### 処理概要
* ユーザがチャットをする際、一番はじめに使う


+ Parameters

    + user: 田中実 (string,require) -- 送り主のユーザ名
    + touser: 佐藤和子 (string,require) -- 送る相手のユーザ名

+ Response 200 (application/json)

        [
            {
                "username": "佐藤 和子", -- ユーザ名
                "flag": 1, -- 送り主(0)か送り先(1)か
                "text": "わかりました、５時に花丸駅に向かいます。", -- 文章
                "datetime": "2018-09-26 15:30:02" -- 時間
            },
            {
                "username": "田中 実", -- ユーザ名
                "flag": 0, -- 送り主(0)か送り先(1)か
                "text": "食品受け渡しは花丸駅でよろしくおねがいします。", -- 文章
                "datetime": "2018-09-26 15:28:33" -- 時間
            }
        ]

+ Response 200 (application/json)

        [
            {
                "status":{err出力}
            }
        ]

# POST /api/postchat

# おすそわけチャット送信用

#### 処理概要

* ユーザがチャットをする際に使う

+ Request(application/json)

            {
                "user":"田中実", -- 送り主の
                "touser":"佐藤和子", -- 送り先のusername
                "text":"食品受け渡しは花丸駅でよろしくおねがいします。" -- 文章
            }



+ Response 200 (application/json)

        [
            {
                "msg": "succeed",
            }
        ]

+ Response 200 (application/json)

        [
            {
                "status":{err出力}
            }
        ]

# GET /api/getchatlist

# チャット相手のリスト表示

#### 処理概要

* チャットをしている相手のリストを表示する。

+ Parameters

    + user: 田中実 (string,require) -- 送り主のユーザ名

+ Response 200 (application/json)

        [
            {
                "username": "佐藤 和子", -- ユーザ名
            },
            {
                "username": "鈴木太郎", -- ユーザ名
            }
        ]

