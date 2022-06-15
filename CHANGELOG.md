# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.5.10](https://git.stack-it.ru/clients/stack-manager/compare/v0.5.9...v0.5.10) (2022-06-15)


### Features

* переделал интерфейс на карточки вместо экспандов ([2e1969f](https://git.stack-it.ru/clients/stack-manager/commit/2e1969f51c7ca02b7b999cf4b4c38c92c2d22b4e))


### Bug Fixes

* обновление папки фронта, если разные каталоги с проектом ([06817cb](https://git.stack-it.ru/clients/stack-manager/commit/06817cb147be0d8a6aa674bd1adc9355662c62f6))

### [0.5.9](https://git.stack-it.ru/clients/stack-manager/compare/v0.5.8...v0.5.9) (2022-06-10)


### Features

* для гейтвэя теперь выбираем только каталог, файл настроек ищется как application.yml в папке ([1cdaa64](https://git.stack-it.ru/clients/stack-manager/commit/1cdaa64cdba45fca7f7cc2248bec662dde32447b))
* для app_host шара и аплоад через gateway ([5365c86](https://git.stack-it.ru/clients/stack-manager/commit/5365c86fd920c7043533eed35c27c1b87b972e7e))
* сохраняем признак что задача принудительно выключена и не стартуем ее при пересборке ([f7d5b44](https://git.stack-it.ru/clients/stack-manager/commit/f7d5b44b39e981b14b1e8fb32fe62e7f61b62ddc))

### [0.5.8](https://git.stack-it.ru/clients/stack-manager/compare/v0.5.7...v0.5.8) (2022-05-19)


### Features

* копирование gateway в каталог <project>\StackGateway ([4cf409f](https://git.stack-it.ru/clients/stack-manager/commit/4cf409f65dd90a59350be20075df17b00321a10d))


### Bug Fixes

* добавил проверку наличия application.yml ([2389948](https://git.stack-it.ru/clients/stack-manager/commit/238994864cca12db68d77254969771fc9395f3d2))
* запрет запуска нескольких окон приложения ([b908b0f](https://git.stack-it.ru/clients/stack-manager/commit/b908b0fd4f55eb8d57d675c78c4e2ccd8b700d44))
* исправил удаление gateway при смене имени проекта ([26e8b51](https://git.stack-it.ru/clients/stack-manager/commit/26e8b5158396ab6a44d9d9aa09b9d86833d82429))

### [0.5.7](https://git.stack-it.ru/clients/stack-manager/compare/v0.5.6...v0.5.7) (2022-05-12)


### Features

* режим цветовой слепоты ([396204d](https://git.stack-it.ru/clients/stack-manager/commit/396204d5a2c274271a58c7cd97c9cbd262809ec6)), closes [#6](https://git.stack-it.ru/clients/stack-manager/issues/6)


### Bug Fixes

* в случае ошибки диспетчера, увеличиваем интервал обновлений до минуты ([0427760](https://git.stack-it.ru/clients/stack-manager/commit/0427760e0ce618389bbaaad12836efedac1b770e))
* для режима цветовой слепоты синим делаем остановленные задачи ([fb2b94e](https://git.stack-it.ru/clients/stack-manager/commit/fb2b94ebe35eb4f88e91625d25e2b95e32006c0c))
* простановка типа проекта ([90c2bfa](https://git.stack-it.ru/clients/stack-manager/commit/90c2bfa843908da54c0fcd7a4ee1e9c909b4d589))

### [0.5.6](https://git.stack-it.ru/clients/stack-manager/compare/v0.5.5...v0.5.6) (2022-05-08)


### Bug Fixes

* исправил получение записей вебсервера ([028d100](https://git.stack-it.ru/clients/stack-manager/commit/028d100cdb2388197d6eefc83d38eaf79f2305e7)), closes [#2](https://git.stack-it.ru/clients/stack-manager/issues/2)
* исправлена замена stack.exe при пересборке ([8efa09b](https://git.stack-it.ru/clients/stack-manager/commit/8efa09b137e60769d5a24187f93614ef6e11f3d8)), closes [#1](https://git.stack-it.ru/clients/stack-manager/issues/1)
* проверка обновлений раз в сутки ([ca67613](https://git.stack-it.ru/clients/stack-manager/commit/ca67613416ceb6ae63583bbfedffb1b6c9719226))

### [0.5.5](https://git.stack-it.ru/clients/stack-manager/compare/v0.5.3...v0.5.5) (2022-05-06)


### Features

* добавил проверку обновлений и их установку ([17ee90d](https://git.stack-it.ru/clients/stack-manager/commit/17ee90dbe559ee62685d2c8f8635f07bfefbddaa)), closes [#3](https://git.stack-it.ru/clients/stack-manager/issues/3)
* добавил сообщение при отсутствии собранного фронта в каталоге ([152fe5d](https://git.stack-it.ru/clients/stack-manager/commit/152fe5dee9a68440bf75526dff2ae71d722e3fbc))
* добавил футер с системными сообщениями и ошибками ([80a1fcd](https://git.stack-it.ru/clients/stack-manager/commit/80a1fcd0b411fd4c60496eb93740fd05eac6ccec))
* открытие папки в проводнике ([442bf72](https://git.stack-it.ru/clients/stack-manager/commit/442bf725513530bd75b96d89e18e1581c1ef926b))
* создание .env.local если отсутствует ([3ae9ed4](https://git.stack-it.ru/clients/stack-manager/commit/3ae9ed4a63a98c672e954b750e43dd9a3b3564d5)), closes [#11](https://git.stack-it.ru/clients/stack-manager/issues/11)


### Bug Fixes

* поправил затирание списка задач ([069bda4](https://git.stack-it.ru/clients/stack-manager/commit/069bda45a552b67e250adb06ba22defc218b4f93))

### [0.5.3](https://git.stack-it.ru/clients/stack-manager/compare/v0.5.2...v0.5.3) (2022-04-24)


### Features

* выбор настроек гейтвэя ([2b586e2](https://git.stack-it.ru/clients/stack-manager/commit/2b586e2c650a00a5acbbe1a41ed8eabef314159d))


### Bug Fixes

* исправил  получение состояний приложений ([80cd6c6](https://git.stack-it.ru/clients/stack-manager/commit/80cd6c6b79e8c301a695f754d1c3ab451a0f8647))
* исправил определение расширений конфигов ([666c889](https://git.stack-it.ru/clients/stack-manager/commit/666c889d70ce1b8748eecdb90b3c6c893e5c0a77))
* исправил рестарт для 2109 ([42f1d65](https://git.stack-it.ru/clients/stack-manager/commit/42f1d65ecf6893e06b87701caaae5a1339351c22))

### [0.5.2](https://git.stack-it.ru/clients/stack-manager/compare/v0.5.1...v0.5.2) (2022-04-18)


### Bug Fixes

* починил сборку фронта ([3067045](https://git.stack-it.ru/clients/stack-manager/commit/3067045a8270ada8eaba3d6ac5aa39cd3494710d))

### [0.5.1](https://git.stack-it.ru/clients/stack-manager/compare/v0.5.0...v0.5.1) (2022-04-17)


### Bug Fixes

* исправил удаление проекта при отсутствии гейтвэя ([7cf451e](https://git.stack-it.ru/clients/stack-manager/commit/7cf451e6acfb9d86e77da1c74f4944c5a5f860c9))

## [0.5.0](https://git.stack-it.ru/clients/stack-manager/compare/v0.4.1...v0.5.0) (2022-04-17)


### Features

* добавил проверку используемых портов ([bcd9594](https://git.stack-it.ru/clients/stack-manager/commit/bcd95947c784b4d744201202a7a902620f24cecc))
* добавил разворачивание версии 2109+ ([41305d0](https://git.stack-it.ru/clients/stack-manager/commit/41305d08a954079031e1359e5567a9c56ff19f13))
* добавил git pull ([2858448](https://git.stack-it.ru/clients/stack-manager/commit/285844864012a1ec5fb44263c12bfa3135be0005))
* заполнение проектов при первом входе ([2a62f92](https://git.stack-it.ru/clients/stack-manager/commit/2a62f92916562599eaf62a52bfefb695ceba1988))


### Bug Fixes

* открытие внешних линков списка изменений во внешнем браузере ([b367061](https://git.stack-it.ru/clients/stack-manager/commit/b3670615f1eab661236adf55b275223f804778b5))
* поправил перезапись папки собранного фронта ([26bc520](https://git.stack-it.ru/clients/stack-manager/commit/26bc5200db6947852cf1e20e1d7546e08b80d7f1))

### 0.4.1 (2022-03-23)


### Features

* добавил логирование ([25bd36e](https://git.stack-it.ru/clients/stack-manager/commit/25bd36e437ed6f9dd08f6e72242dfe1452a75493))
* добавил обработку и отображение ошибок ([0118ddc](https://git.stack-it.ru/clients/stack-manager/commit/0118ddcb2f3ef8408a252b44282ec2f9c05cc79e))
* добавил парсинг вебсерверов диспетчера для заполнения проектов ([f0e1e92](https://git.stack-it.ru/clients/stack-manager/commit/f0e1e92a31dca1125c3174621385bc3b747a9982))
* добавил сборку фронта ([1bd55b1](https://git.stack-it.ru/clients/stack-manager/commit/1bd55b1f0977b7f3e2fcda14c30934e0f18fdebe))
* добавил сворачивание в трэй ([32f2435](https://git.stack-it.ru/clients/stack-manager/commit/32f24352d7d90f813db30013cc04684209597aaa))
* добавил создание вебсервера в диспетчере ([0b9258a](https://git.stack-it.ru/clients/stack-manager/commit/0b9258a39d0ea81b1078a9f5517c1139dd83658b))
* добавил express для статики ([438ba0e](https://git.stack-it.ru/clients/stack-manager/commit/438ba0e07563b59f597577e5a87d2dd04a894011))
* добавлено создание шары и аплоада из настроек ([68e681f](https://git.stack-it.ru/clients/stack-manager/commit/68e681fa4f601ac7142cea3685747bc009e8292f))
* кнопка списка изменений в настройки ([e9219b2](https://git.stack-it.ru/clients/stack-manager/commit/e9219b2549ad5d9d75f477a4b2a582d8066c7cb5))
* обновление всех приложений проекта ([4cbb5f6](https://git.stack-it.ru/clients/stack-manager/commit/4cbb5f60c3f11aee41eb907021ce35f1601e49da))
* обработка include в stack.ini ([bfc8dff](https://git.stack-it.ru/clients/stack-manager/commit/bfc8dff2fd51f1dfbe1111da0835c08e8251bc71))
* отображение списка изменений в окне программы ([a0cef69](https://git.stack-it.ru/clients/stack-manager/commit/a0cef69b542e8bcbb96a4216c35165b1fdad50a7))
* отображениее списка изменений ([c29eb7a](https://git.stack-it.ru/clients/stack-manager/commit/c29eb7af9abac0f738c8e6f0bf1ffcddf7880bb0))
* перезагрузка диспетчера ([4a11698](https://git.stack-it.ru/clients/stack-manager/commit/4a1169862c48e402f2f90f81d5fea0a7290c8450))
* перетаскивание проектов для личной сортировки ([1a28d7c](https://git.stack-it.ru/clients/stack-manager/commit/1a28d7ca0fb962ba447e02035c96a27d2f225b33))
* при старте и рестарте, так-же меняюем активность приложения ([0d268d6](https://git.stack-it.ru/clients/stack-manager/commit/0d268d6e0a18401c33f9b0d60e2538c727ffbcc7))
* проверка путей при создании проекта ([fe5aaea](https://git.stack-it.ru/clients/stack-manager/commit/fe5aaead191b94d038a5cec5364532e871e53527))
* создание и парсинг проектов ([8743425](https://git.stack-it.ru/clients/stack-manager/commit/8743425d31de4edc2e3371e4e5a735e175a79d58))
* список задач и валидация формы ([f8e7937](https://git.stack-it.ru/clients/stack-manager/commit/f8e79372b4e06df843acb9b78a85203ab7be209f))
* статусы приложений. остановка и запуск ([6044492](https://git.stack-it.ru/clients/stack-manager/commit/6044492f29676858a047d88cd52dad55ccefc5d3))
* удаление и пересборка проекта при редактировании ([7306b07](https://git.stack-it.ru/clients/stack-manager/commit/7306b07373a80c00653bfde631c8516eead79c32))
* **ul:** деплой собранного фронта ([d49d5d1](https://git.stack-it.ru/clients/stack-manager/commit/d49d5d1785667b2cc9d45858083b16375afab390))


### Bug Fixes

* заполняем схему для mssql сборок в stack.ini ([3f50ded](https://git.stack-it.ru/clients/stack-manager/commit/3f50ded7ad73684784d938c8515b283331d2ce1d))
* исправил невозможность выйти из приложения ([78de7a0](https://git.stack-it.ru/clients/stack-manager/commit/78de7a0631e70dc2cfbbebebbe63c5aac711d2b3))
* исправил определение каталога bin, если не указан в настройках ([dba3971](https://git.stack-it.ru/clients/stack-manager/commit/dba3971ae45261a7947c9df07699d8fe8bb2c3c7))
* исправил переименование приложений при смене имени проекта ([cb64467](https://git.stack-it.ru/clients/stack-manager/commit/cb64467b8f4bfce662aa6885ab09f743516a9593))
* исправил пересоздание проекта ([780fc9f](https://git.stack-it.ru/clients/stack-manager/commit/780fc9f7a76c331807ca478f2c5d304e541fa558))
* исправил подключение include при прасниге инишки ([87d6062](https://git.stack-it.ru/clients/stack-manager/commit/87d60626b8bc47e7e9717c1c7a000280af5e7d33))
* исправил удаление нулевого проекта ([0395f7e](https://git.stack-it.ru/clients/stack-manager/commit/0395f7ec8f26dcd41d330dcf9c0f453e9ef71afd))
* исправление сборки после обновления npm ([9a83f5e](https://git.stack-it.ru/clients/stack-manager/commit/9a83f5e087b8a8cdcfcce810fcf40e779b552c2b))
* исправления ([4daa63c](https://git.stack-it.ru/clients/stack-manager/commit/4daa63c531db2dcb1cf6bc48da6a7e04c96d63ab))
* обработку include вынес в чтение ini файла ([abff90b](https://git.stack-it.ru/clients/stack-manager/commit/abff90b381578e651c17ffa1d13a16b8fa706abd))
* опечатка в имени метода, не работал рестарт ([bb82c6e](https://git.stack-it.ru/clients/stack-manager/commit/bb82c6e3c045cd8bd860eb39256b3d9e07580fdd))
* ошибки типизации ([38c536d](https://git.stack-it.ru/clients/stack-manager/commit/38c536dca43e4fdc310cfafd6a7c799e3db0bbd6))
* перенес обновление статусов на главную ([729e2a8](https://git.stack-it.ru/clients/stack-manager/commit/729e2a881569cb6c020267bf96a09b1a5ae8f411))
* поправил заполнение проектов, если имена меньше 2х символов ([8a0f6e2](https://git.stack-it.ru/clients/stack-manager/commit/8a0f6e2bf2b139e1f58308d3e6942e9cc3f09b32))
* поправил обработку ошибок при заполнении проектов ([f624502](https://git.stack-it.ru/clients/stack-manager/commit/f6245024b39ce069cf5c77dcdf1a7895317702a3))
* поправил создание проекта ([3e058f5](https://git.stack-it.ru/clients/stack-manager/commit/3e058f51621e548cb56be46bf912ffa830badf6e))
* реавторизация в диспетчере и отображение ошибокреавторизация в диспетчере и отображение ошибок ([9f4ba0a](https://git.stack-it.ru/clients/stack-manager/commit/9f4ba0a650b02fa050731a31eff2ce0557804298))
* ряд исправлений ([29e87db](https://git.stack-it.ru/clients/stack-manager/commit/29e87db4ed429abd82941684a6341966d47aa687))
* убрал лишние кавычки при разборе аргументов ([0bcbc74](https://git.stack-it.ru/clients/stack-manager/commit/0bcbc7462ef350f25c2920a903c360b1c1996eb8))
* убрал логирование в консоль для production ([635f3a4](https://git.stack-it.ru/clients/stack-manager/commit/635f3a43dc31e81181aa9a435024898f869572f4))
* inspect в команду запуска ([2ae5000](https://git.stack-it.ru/clients/stack-manager/commit/2ae500091e6665baeddae82276982038a830095d))
