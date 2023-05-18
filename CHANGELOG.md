# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.7.14](https://github.com/stonum/stack-manager/compare/v0.7.13...v0.7.14) (2023-05-18)


### Features

* в воркспейс добавляются каталоги docker и stack.Help если есть в проекте ([53b6509](https://github.com/stonum/stack-manager/commit/53b65095ee3a053db3427033ef41ad3a3aa15ae9))

### [0.7.13](https://github.com/stonum/stack-manager/compare/v0.7.12...v0.7.13) (2023-04-13)


### Features

* создание разных env.local файлов под разные проекты ([8fa5b70](https://github.com/stonum/stack-manager/commit/8fa5b702585ea1bf8d171a1991e880746bf1a52a))


### Bug Fixes

* инициализация порта gateway для нового проекта ([c43f4ef](https://github.com/stonum/stack-manager/commit/c43f4efbf89eabbd63119328c027dc26fc125bb5))
* исправил обработку наличия уже занятых портов ([b40adb7](https://github.com/stonum/stack-manager/commit/b40adb738ef50d8d35b576a63d379f7fbda9741e))

### [0.7.12](https://github.com/stonum/stack-manager/compare/v0.7.11...v0.7.12) (2023-03-13)


### Features

* автоматическое вычисление свободных портов для нового проекта ([4aa3843](https://github.com/stonum/stack-manager/commit/4aa38434555fd3cf17bc7d71ca81ad0efc95d8d2))
* добавил поддержку единой сервисной очереди ([7f128fa](https://github.com/stonum/stack-manager/commit/7f128fac5541194032907955485a9ece9c3427d3))
* добавлен уникальный id проекта ([b01dc06](https://github.com/stonum/stack-manager/commit/b01dc06763e7f08484ac7a74efcfbbd8d39ffd3f))


### Bug Fixes

* строка пробелов в ini файле преобразовывалась в "=true" ([689c31a](https://github.com/stonum/stack-manager/commit/689c31aed471f5ab613d1080f91593de7d7da935))
* jwt секция в  application.yml ([e630c5e](https://github.com/stonum/stack-manager/commit/e630c5e7bee1639a38636aebee8044ce06f5115d))

### [0.7.11](https://github.com/stonum/stack-manager/compare/v0.7.10...v0.7.11) (2023-02-17)


### Features

* bootstrap config для stackgateway ([e66fed9](https://github.com/stonum/stack-manager/commit/e66fed95c47fea81fcd434d10eaab6b36c058218))


### Bug Fixes

* обработка URL адреса диспетчера ([2cfce7c](https://github.com/stonum/stack-manager/commit/2cfce7cf150ee7ea73576e7a663ea1665f9e1f75))

### [0.7.10](https://github.com/stonum/stack-manager/compare/v0.7.9...v0.7.10) (2023-02-13)


### Bug Fixes

* исправил копирование каталогов при создании нового проекта ([76fe653](https://github.com/stonum/stack-manager/commit/76fe653769a19050fed66ddae2c65892199fb27c))
* копирование 1го проекта ([a20dcdd](https://github.com/stonum/stack-manager/commit/a20dcdd66eee7731914e9af196180835b7b9f892))

### [0.7.9](https://github.com/stonum/stack-manager/compare/v0.7.8...v0.7.9) (2023-01-31)


### Features

* удаление записей из истории ввода ([dcc6f0b](https://github.com/stonum/stack-manager/commit/dcc6f0bfc8c410a2a0a27085eaf8f991c0304d7a))


### Bug Fixes

* исправил сохранение истории ввода ([b1c2235](https://github.com/stonum/stack-manager/commit/b1c223560c05d972bcfd6fd3e839b9b3c32adfc9))
* trustedServer по умолчанию ([bb78215](https://github.com/stonum/stack-manager/commit/bb78215c68af321743583ede545af731bbc37c8b))

### [0.7.8](https://github.com/stonum/stack-manager/compare/v0.7.7...v0.7.8) (2023-01-17)


### Features

* добавил вкладку с доп. настройками ([754ccf2](https://github.com/stonum/stack-manager/commit/754ccf2c8a5e05eb7f91529ddb8081874913e0b4))


### Bug Fixes

* исправлено определение переменных окружения ([f76d8bf](https://github.com/stonum/stack-manager/commit/f76d8bfad554f20a16f240d31f4606de2474f1d3))
* не сбрасываем выбранную версию, если при смене ini файла не нашли другую ([cd1645c](https://github.com/stonum/stack-manager/commit/cd1645c199248e0d834cfcc5c1c33f8ae359ae84))

### [0.7.7](https://github.com/stonum/stack-manager/compare/v0.7.6...v0.7.7) (2023-01-10)


### Features

* add codeTask to application.yml ([4fc4d8b](https://github.com/stonum/stack-manager/commit/4fc4d8be839fbf445131e05ed6ab585a5452cf28))


### Bug Fixes

* close window ([403b0fb](https://github.com/stonum/stack-manager/commit/403b0fbd7bb235bc1cad6e81544997f9a48daf50))

### [0.7.6](https://github.com/stonum/stack-manager/compare/v0.7.5...v0.7.6) (2022-12-30)


### Features

*  сохранение размеров и позиции окна ([008c84c](https://github.com/stonum/stack-manager/commit/008c84ce78e1be0af41246014b8c9b0469f8e59c))
* добавлен trustedServer в yml для stackgateway ([50ba1a5](https://github.com/stonum/stack-manager/commit/50ba1a531aa0234307dc375640ecb25be2c77bf9))

### [0.7.5](https://github.com/stonum/stack-manager/compare/v0.7.4...v0.7.5) (2022-12-15)


### Features

* возможность ресайза окна приложения ([288eb2e](https://github.com/stonum/stack-manager/commit/288eb2ec4fc097fd7fca87dfb3e0778c1bd5015e))
* отображение сервера и базы на карточке проекта ([267557b](https://github.com/stonum/stack-manager/commit/267557bb4004e9e1957b181d37ea6cc074dc7f88))

### [0.7.4](https://github.com/Stonum/stack-manager/compare/v0.7.3...v0.7.4) (2022-11-28)


### Features

* добавил копирование проекта ([d04e5c7](https://github.com/Stonum/stack-manager/commit/d04e5c79d4c2243bfa86ba9065a5b4a176ca2702))

### [0.7.3](https://github.com/Stonum/stack-manager/compare/v0.7.2...v0.7.3) (2022-11-25)


### Features

* возможность смены типа проекта ([7ffbf1d](https://github.com/Stonum/stack-manager/commit/7ffbf1d3028014201159c7dd7c7671cc2dc76b0f))
* добавил возможность указать макс. кол-во перезапусков ([8848a42](https://github.com/Stonum/stack-manager/commit/8848a42352f72dd83618fc2abac361323b910df9))

### [0.7.2](https://github.com/Stonum/stack-manager/compare/v0.7.1...v0.7.2) (2022-10-14)


### Bug Fixes

* путь к каталогу Stack.Srv в workspacefix: исправлен путь к каталогу Stack.Srv в workspace ([157c76f](https://github.com/Stonum/stack-manager/commit/157c76fc611aa5b22ad6b8455cedf6702fddf8b3))

### [0.7.1](https://github.com/Stonum/stack-manager/compare/v0.7.0...v0.7.1) (2022-10-07)


### Features

* возможность ручного редактирования путей к каталогам и файлам ([67e21dc](https://github.com/Stonum/stack-manager/commit/67e21dc3f7be6007b5f0bc421cdfcc2575d39bf3))
* опрос диспетчера только если приложение не перекрыто и не свернуто ([0ec74b1](https://github.com/Stonum/stack-manager/commit/0ec74b145714c779ea82ba8926a70b2243cdbcf4))
* открытие папки с exe ([22da3c9](https://github.com/Stonum/stack-manager/commit/22da3c9fa0af8a9834b187f81436e1b1c4ffe4c3)), closes [#12](https://github.com/Stonum/stack-manager/issues/12)


### Bug Fixes

* исправил высоту области под скролл ([dc6b960](https://github.com/Stonum/stack-manager/commit/dc6b96089ec51703efffe68777c3535ef3f7eaeb))
* **vue3:** исправил логирование ([fa35110](https://github.com/Stonum/stack-manager/commit/fa351103a30d9e1af35f44c60efd784f77a43763))
* **vue3:** исправил путь до файла со списком изменений ([092e9b0](https://github.com/Stonum/stack-manager/commit/092e9b066a0087c8f8ca61ef2147f88e3357e682))
* **vue3:** исправил работу статик сервера ([0725277](https://github.com/Stonum/stack-manager/commit/0725277f30f8e1cd0d1c8c22f66b0d3b0daa34b3))
* **vue3:** исправил рестарт программы автозапуска ([2800717](https://github.com/Stonum/stack-manager/commit/2800717c709ed467c031f96afe51e315f4eaa2c6))

## [0.7.0](https://github.com/Stonum/stack-manager/compare/v0.6.7...v0.7.0) (2022-10-01)

### [0.6.7](https://github.com/Stonum/stack-manager/compare/v0.6.6...v0.6.7) (2022-08-10)


### Features

* добавил возможность указать порт PSQL сервера через ":" в адресе сервера проекта ([ad71386](https://github.com/Stonum/stack-manager/commit/ad7138674cc75cf72df9113f11f3842cf00877b0))

### [0.6.6](https://github.com/Stonum/stack-manager/compare/v0.6.5...v0.6.6) (2022-08-05)


### Bug Fixes

* в workspace добавляем stack.iniPath для более корректного разбора каталогов расширением stack ([49f09a0](https://github.com/Stonum/stack-manager/commit/49f09a0cfcc5337e3a57daee8dbadaea33ffd462))
* убрал админку из bundles для фронта ([f0674ae](https://github.com/Stonum/stack-manager/commit/f0674ae4094d5038b697ab64999e624aca2cb7ff))

### [0.6.5](https://github.com/Stonum/stack-manager/compare/v0.6.4...v0.6.5) (2022-07-27)


### Features

* в настройки вынес каталог, где будут создаваться workspace ([ecfda88](https://github.com/Stonum/stack-manager/commit/ecfda88de729b0e51dbae3c5d1cf52be94db80c6))
* хранение состояний проекта в store. запрет многократного запуска сборки фронта ([ac97bb7](https://github.com/Stonum/stack-manager/commit/ac97bb7721faff00531ac9fbaa437da13f108500))


### Bug Fixes

* убрал лишние мерцания статусов ([c9c296c](https://github.com/Stonum/stack-manager/commit/c9c296c260b354e95f16faa5f83dbb53898a4658))

### [0.6.4](https://github.com/Stonum/stack-manager/compare/v0.6.3...v0.6.4) (2022-07-20)


### Features

* добавил toast на info сообщения ([e680ab8](https://github.com/Stonum/stack-manager/commit/e680ab8fa5b4af2037e00e77cc9773b48758a22f))


### Bug Fixes

* исправил заполнение проектов, если нет логина пароля в командной строке ([63fdf49](https://github.com/Stonum/stack-manager/commit/63fdf49dcbe29f54afb61fa19af370d52ee5a34b)), closes [#9](https://github.com/Stonum/stack-manager/issues/9)
* исправил каталог версии в генерируемом workspace ([ef37a01](https://github.com/Stonum/stack-manager/commit/ef37a014ff6dabc9876aa14e46d403b74b9254ba)), closes [#10](https://github.com/Stonum/stack-manager/issues/10)

### [0.6.3](https://github.com/Stonum/stack-manager/compare/v0.6.2...v0.6.3) (2022-07-19)


### Bug Fixes

* в свернутом состоянии не опрашиваем диспетчер ([34f0637](https://github.com/Stonum/stack-manager/commit/34f063723be6ca66b5956f6fde18244315cf1a71))
* удаление лишних ключей при генерации env конфига ([4a88c26](https://github.com/Stonum/stack-manager/commit/4a88c26bbd4b4e1093116dedc662b83574276558))

### [0.6.2](https://github.com/Stonum/stack-manager/compare/v0.6.1...v0.6.2) (2022-07-07)


### Bug Fixes

* поправил создание конфига рабочей области, теперь там 3 папки - фронт, гит и версия. ([d59c7b8](https://github.com/Stonum/stack-manager/commit/d59c7b8fb9748f8d20c2e15db235806d5158d741))
* убрал лишние ключи из env, пересобираем env.local при сборке проекта ([3cb394b](https://github.com/Stonum/stack-manager/commit/3cb394b6ad95b46fccebcf91477cbc10144daeec))

### [0.6.1](https://github.com/Stonum/stack-manager/compare/v0.6.0...v0.6.1) (2022-07-01)


### Bug Fixes

* вернул кнопки создания сервисов и справочные иконки ([e90f4c5](https://github.com/Stonum/stack-manager/commit/e90f4c54f9d75ec7a0b46c963013541829d38066))

## [0.6.0](https://github.com/Stonum/stack-manager/compare/v0.5.11...v0.6.0) (2022-07-01)


### Features

* отображение количества сообщений, и возможность их очистить ([61921e0](https://github.com/Stonum/stack-manager/commit/61921e0e7559885f5427518fe334793f79b24524))
* реализовал генерацию рабочей области VsCode и ее открытие по проекту ([a4c7169](https://github.com/Stonum/stack-manager/commit/a4c71690dd7be31160c66ecf6e6ff27aa8d256c4))
* события диспетчера отображаем только за текущие сутки ([850eec4](https://github.com/Stonum/stack-manager/commit/850eec4ddde98b77deae226924d961b8ca6bc1b0))


### Bug Fixes

* исправил проверку версии для инст проектов ([ce7b12a](https://github.com/Stonum/stack-manager/commit/ce7b12a8b4ff22feeed39d91c62c530dbab022a2))
* сворачивание папок для вокрспэйса ([94d649a](https://github.com/Stonum/stack-manager/commit/94d649a4dcfd3bfbdeb4bf3088bf84eb500ff1c7))

### [0.5.11](https://github.com/Stonum/stack-manager/compare/v0.5.10...v0.5.11) (2022-06-20)


### Bug Fixes

* исправил обновление статусов после удаления проекта ([220fd6c](https://github.com/Stonum/stack-manager/commit/220fd6c7094291d945f375a485c38df27a09d61d))
* поправил пути до статики в env для stackgateway 0.0.3 ([436d0e6](https://github.com/Stonum/stack-manager/commit/436d0e628f5332d3688158d59625eea59b95825d))

### [0.5.10](https://github.com/Stonum/stack-manager/compare/v0.5.9...v0.5.10) (2022-06-15)


### Features

* переделал интерфейс на карточки вместо экспандов ([2e1969f](https://github.com/Stonum/stack-manager/commit/2e1969f51c7ca02b7b999cf4b4c38c92c2d22b4e))


### Bug Fixes

* обновление папки фронта, если разные каталоги с проектом ([06817cb](https://github.com/Stonum/stack-manager/commit/06817cb147be0d8a6aa674bd1adc9355662c62f6))

### [0.5.9](https://github.com/Stonum/stack-manager/compare/v0.5.8...v0.5.9) (2022-06-10)


### Features

* для гейтвэя теперь выбираем только каталог, файл настроек ищется как application.yml в папке ([1cdaa64](https://github.com/Stonum/stack-manager/commit/1cdaa64cdba45fca7f7cc2248bec662dde32447b))
* для app_host шара и аплоад через gateway ([5365c86](https://github.com/Stonum/stack-manager/commit/5365c86fd920c7043533eed35c27c1b87b972e7e))
* сохраняем признак что задача принудительно выключена и не стартуем ее при пересборке ([f7d5b44](https://github.com/Stonum/stack-manager/commit/f7d5b44b39e981b14b1e8fb32fe62e7f61b62ddc))

### [0.5.8](https://github.com/Stonum/stack-manager/compare/v0.5.7...v0.5.8) (2022-05-19)


### Features

* копирование gateway в каталог <project>\StackGateway ([4cf409f](https://github.com/Stonum/stack-manager/commit/4cf409f65dd90a59350be20075df17b00321a10d))


### Bug Fixes

* добавил проверку наличия application.yml ([2389948](https://github.com/Stonum/stack-manager/commit/238994864cca12db68d77254969771fc9395f3d2))
* запрет запуска нескольких окон приложения ([b908b0f](https://github.com/Stonum/stack-manager/commit/b908b0fd4f55eb8d57d675c78c4e2ccd8b700d44))
* исправил удаление gateway при смене имени проекта ([26e8b51](https://github.com/Stonum/stack-manager/commit/26e8b5158396ab6a44d9d9aa09b9d86833d82429))

### [0.5.7](https://github.com/Stonum/stack-manager/compare/v0.5.6...v0.5.7) (2022-05-12)


### Features

* режим цветовой слепоты ([396204d](https://github.com/Stonum/stack-manager/commit/396204d5a2c274271a58c7cd97c9cbd262809ec6)), closes [#6](https://github.com/Stonum/stack-manager/issues/6)


### Bug Fixes

* в случае ошибки диспетчера, увеличиваем интервал обновлений до минуты ([0427760](https://github.com/Stonum/stack-manager/commit/0427760e0ce618389bbaaad12836efedac1b770e))
* для режима цветовой слепоты синим делаем остановленные задачи ([fb2b94e](https://github.com/Stonum/stack-manager/commit/fb2b94ebe35eb4f88e91625d25e2b95e32006c0c))
* простановка типа проекта ([90c2bfa](https://github.com/Stonum/stack-manager/commit/90c2bfa843908da54c0fcd7a4ee1e9c909b4d589))

### [0.5.6](https://github.com/Stonum/stack-manager/compare/v0.5.5...v0.5.6) (2022-05-08)


### Bug Fixes

* исправил получение записей вебсервера ([028d100](https://github.com/Stonum/stack-manager/commit/028d100cdb2388197d6eefc83d38eaf79f2305e7)), closes [#2](https://github.com/Stonum/stack-manager/issues/2)
* исправлена замена stack.exe при пересборке ([8efa09b](https://github.com/Stonum/stack-manager/commit/8efa09b137e60769d5a24187f93614ef6e11f3d8)), closes [#1](https://github.com/Stonum/stack-manager/issues/1)
* проверка обновлений раз в сутки ([ca67613](https://github.com/Stonum/stack-manager/commit/ca67613416ceb6ae63583bbfedffb1b6c9719226))

### [0.5.5](https://github.com/Stonum/stack-manager/compare/v0.5.3...v0.5.5) (2022-05-06)


### Features

* добавил проверку обновлений и их установку ([17ee90d](https://github.com/Stonum/stack-manager/commit/17ee90dbe559ee62685d2c8f8635f07bfefbddaa)), closes [#3](https://github.com/Stonum/stack-manager/issues/3)
* добавил сообщение при отсутствии собранного фронта в каталоге ([152fe5d](https://github.com/Stonum/stack-manager/commit/152fe5dee9a68440bf75526dff2ae71d722e3fbc))
* добавил футер с системными сообщениями и ошибками ([80a1fcd](https://github.com/Stonum/stack-manager/commit/80a1fcd0b411fd4c60496eb93740fd05eac6ccec))
* открытие папки в проводнике ([442bf72](https://github.com/Stonum/stack-manager/commit/442bf725513530bd75b96d89e18e1581c1ef926b))
* создание .env.local если отсутствует ([3ae9ed4](https://github.com/Stonum/stack-manager/commit/3ae9ed4a63a98c672e954b750e43dd9a3b3564d5)), closes [#11](https://github.com/Stonum/stack-manager/issues/11)


### Bug Fixes

* поправил затирание списка задач ([069bda4](https://github.com/Stonum/stack-manager/commit/069bda45a552b67e250adb06ba22defc218b4f93))

### [0.5.3](https://github.com/Stonum/stack-manager/compare/v0.5.2...v0.5.3) (2022-04-24)


### Features

* выбор настроек гейтвэя ([2b586e2](https://github.com/Stonum/stack-manager/commit/2b586e2c650a00a5acbbe1a41ed8eabef314159d))


### Bug Fixes

* исправил  получение состояний приложений ([80cd6c6](https://github.com/Stonum/stack-manager/commit/80cd6c6b79e8c301a695f754d1c3ab451a0f8647))
* исправил определение расширений конфигов ([666c889](https://github.com/Stonum/stack-manager/commit/666c889d70ce1b8748eecdb90b3c6c893e5c0a77))
* исправил рестарт для 2109 ([42f1d65](https://github.com/Stonum/stack-manager/commit/42f1d65ecf6893e06b87701caaae5a1339351c22))

### [0.5.2](https://github.com/Stonum/stack-manager/compare/v0.5.1...v0.5.2) (2022-04-18)


### Bug Fixes

* починил сборку фронта ([3067045](https://github.com/Stonum/stack-manager/commit/3067045a8270ada8eaba3d6ac5aa39cd3494710d))

### [0.5.1](https://github.com/Stonum/stack-manager/compare/v0.5.0...v0.5.1) (2022-04-17)


### Bug Fixes

* исправил удаление проекта при отсутствии гейтвэя ([7cf451e](https://github.com/Stonum/stack-manager/commit/7cf451e6acfb9d86e77da1c74f4944c5a5f860c9))

## [0.5.0](https://github.com/Stonum/stack-manager/compare/v0.4.1...v0.5.0) (2022-04-17)


### Features

* добавил проверку используемых портов ([bcd9594](https://github.com/Stonum/stack-manager/commit/bcd95947c784b4d744201202a7a902620f24cecc))
* добавил разворачивание версии 2109+ ([41305d0](https://github.com/Stonum/stack-manager/commit/41305d08a954079031e1359e5567a9c56ff19f13))
* добавил git pull ([2858448](https://github.com/Stonum/stack-manager/commit/285844864012a1ec5fb44263c12bfa3135be0005))
* заполнение проектов при первом входе ([2a62f92](https://github.com/Stonum/stack-manager/commit/2a62f92916562599eaf62a52bfefb695ceba1988))


### Bug Fixes

* открытие внешних линков списка изменений во внешнем браузере ([b367061](https://github.com/Stonum/stack-manager/commit/b3670615f1eab661236adf55b275223f804778b5))
* поправил перезапись папки собранного фронта ([26bc520](https://github.com/Stonum/stack-manager/commit/26bc5200db6947852cf1e20e1d7546e08b80d7f1))

### 0.4.1 (2022-03-23)


### Features

* добавил логирование ([25bd36e](https://github.com/Stonum/stack-manager/commit/25bd36e437ed6f9dd08f6e72242dfe1452a75493))
* добавил обработку и отображение ошибок ([0118ddc](https://github.com/Stonum/stack-manager/commit/0118ddcb2f3ef8408a252b44282ec2f9c05cc79e))
* добавил парсинг вебсерверов диспетчера для заполнения проектов ([f0e1e92](https://github.com/Stonum/stack-manager/commit/f0e1e92a31dca1125c3174621385bc3b747a9982))
* добавил сборку фронта ([1bd55b1](https://github.com/Stonum/stack-manager/commit/1bd55b1f0977b7f3e2fcda14c30934e0f18fdebe))
* добавил сворачивание в трэй ([32f2435](https://github.com/Stonum/stack-manager/commit/32f24352d7d90f813db30013cc04684209597aaa))
* добавил создание вебсервера в диспетчере ([0b9258a](https://github.com/Stonum/stack-manager/commit/0b9258a39d0ea81b1078a9f5517c1139dd83658b))
* добавил express для статики ([438ba0e](https://github.com/Stonum/stack-manager/commit/438ba0e07563b59f597577e5a87d2dd04a894011))
* добавлено создание шары и аплоада из настроек ([68e681f](https://github.com/Stonum/stack-manager/commit/68e681fa4f601ac7142cea3685747bc009e8292f))
* кнопка списка изменений в настройки ([e9219b2](https://github.com/Stonum/stack-manager/commit/e9219b2549ad5d9d75f477a4b2a582d8066c7cb5))
* обновление всех приложений проекта ([4cbb5f6](https://github.com/Stonum/stack-manager/commit/4cbb5f60c3f11aee41eb907021ce35f1601e49da))
* обработка include в stack.ini ([bfc8dff](https://github.com/Stonum/stack-manager/commit/bfc8dff2fd51f1dfbe1111da0835c08e8251bc71))
* отображение списка изменений в окне программы ([a0cef69](https://github.com/Stonum/stack-manager/commit/a0cef69b542e8bcbb96a4216c35165b1fdad50a7))
* отображениее списка изменений ([c29eb7a](https://github.com/Stonum/stack-manager/commit/c29eb7af9abac0f738c8e6f0bf1ffcddf7880bb0))
* перезагрузка диспетчера ([4a11698](https://github.com/Stonum/stack-manager/commit/4a1169862c48e402f2f90f81d5fea0a7290c8450))
* перетаскивание проектов для личной сортировки ([1a28d7c](https://github.com/Stonum/stack-manager/commit/1a28d7ca0fb962ba447e02035c96a27d2f225b33))
* при старте и рестарте, так-же меняюем активность приложения ([0d268d6](https://github.com/Stonum/stack-manager/commit/0d268d6e0a18401c33f9b0d60e2538c727ffbcc7))
* проверка путей при создании проекта ([fe5aaea](https://github.com/Stonum/stack-manager/commit/fe5aaead191b94d038a5cec5364532e871e53527))
* создание и парсинг проектов ([8743425](https://github.com/Stonum/stack-manager/commit/8743425d31de4edc2e3371e4e5a735e175a79d58))
* список задач и валидация формы ([f8e7937](https://github.com/Stonum/stack-manager/commit/f8e79372b4e06df843acb9b78a85203ab7be209f))
* статусы приложений. остановка и запуск ([6044492](https://github.com/Stonum/stack-manager/commit/6044492f29676858a047d88cd52dad55ccefc5d3))
* удаление и пересборка проекта при редактировании ([7306b07](https://github.com/Stonum/stack-manager/commit/7306b07373a80c00653bfde631c8516eead79c32))
* **ul:** деплой собранного фронта ([d49d5d1](https://github.com/Stonum/stack-manager/commit/d49d5d1785667b2cc9d45858083b16375afab390))


### Bug Fixes

* заполняем схему для mssql сборок в stack.ini ([3f50ded](https://github.com/Stonum/stack-manager/commit/3f50ded7ad73684784d938c8515b283331d2ce1d))
* исправил невозможность выйти из приложения ([78de7a0](https://github.com/Stonum/stack-manager/commit/78de7a0631e70dc2cfbbebebbe63c5aac711d2b3))
* исправил определение каталога bin, если не указан в настройках ([dba3971](https://github.com/Stonum/stack-manager/commit/dba3971ae45261a7947c9df07699d8fe8bb2c3c7))
* исправил переименование приложений при смене имени проекта ([cb64467](https://github.com/Stonum/stack-manager/commit/cb64467b8f4bfce662aa6885ab09f743516a9593))
* исправил пересоздание проекта ([780fc9f](https://github.com/Stonum/stack-manager/commit/780fc9f7a76c331807ca478f2c5d304e541fa558))
* исправил подключение include при прасниге инишки ([87d6062](https://github.com/Stonum/stack-manager/commit/87d60626b8bc47e7e9717c1c7a000280af5e7d33))
* исправил удаление нулевого проекта ([0395f7e](https://github.com/Stonum/stack-manager/commit/0395f7ec8f26dcd41d330dcf9c0f453e9ef71afd))
* исправление сборки после обновления npm ([9a83f5e](https://github.com/Stonum/stack-manager/commit/9a83f5e087b8a8cdcfcce810fcf40e779b552c2b))
* исправления ([4daa63c](https://github.com/Stonum/stack-manager/commit/4daa63c531db2dcb1cf6bc48da6a7e04c96d63ab))
* обработку include вынес в чтение ini файла ([abff90b](https://github.com/Stonum/stack-manager/commit/abff90b381578e651c17ffa1d13a16b8fa706abd))
* опечатка в имени метода, не работал рестарт ([bb82c6e](https://github.com/Stonum/stack-manager/commit/bb82c6e3c045cd8bd860eb39256b3d9e07580fdd))
* ошибки типизации ([38c536d](https://github.com/Stonum/stack-manager/commit/38c536dca43e4fdc310cfafd6a7c799e3db0bbd6))
* перенес обновление статусов на главную ([729e2a8](https://github.com/Stonum/stack-manager/commit/729e2a881569cb6c020267bf96a09b1a5ae8f411))
* поправил заполнение проектов, если имена меньше 2х символов ([8a0f6e2](https://github.com/Stonum/stack-manager/commit/8a0f6e2bf2b139e1f58308d3e6942e9cc3f09b32))
* поправил обработку ошибок при заполнении проектов ([f624502](https://github.com/Stonum/stack-manager/commit/f6245024b39ce069cf5c77dcdf1a7895317702a3))
* поправил создание проекта ([3e058f5](https://github.com/Stonum/stack-manager/commit/3e058f51621e548cb56be46bf912ffa830badf6e))
* реавторизация в диспетчере и отображение ошибокреавторизация в диспетчере и отображение ошибок ([9f4ba0a](https://github.com/Stonum/stack-manager/commit/9f4ba0a650b02fa050731a31eff2ce0557804298))
* ряд исправлений ([29e87db](https://github.com/Stonum/stack-manager/commit/29e87db4ed429abd82941684a6341966d47aa687))
* убрал лишние кавычки при разборе аргументов ([0bcbc74](https://github.com/Stonum/stack-manager/commit/0bcbc7462ef350f25c2920a903c360b1c1996eb8))
* убрал логирование в консоль для production ([635f3a4](https://github.com/Stonum/stack-manager/commit/635f3a43dc31e81181aa9a435024898f869572f4))
* inspect в команду запуска ([2ae5000](https://github.com/Stonum/stack-manager/commit/2ae500091e6665baeddae82276982038a830095d))
