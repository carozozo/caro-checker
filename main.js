((g) => {
  // 是否為無定義
  const ifUndefined = (val) => {
    return val === undefined
  }

  // 是否為無效值
  const ifNull = (val) => {
    return val === null
  }

  // 是否為字串
  const ifString = (val) => {
    return typeof val === 'string'
  }

  // 是否為數字
  const ifNumber = (val) => {
    return typeof val === 'number' && !Number.isNaN(val)
  }

  // 是否為布林值
  const ifBoolean = (val) => {
    return typeof val === 'boolean'
  }

  // 是否為陣列
  const ifArray = (val) => {
    return Array.isArray(val)
  }

  // 是否為物件
  const ifObject = (val) => {
    return Object.prototype.toString.call(val) === '[object Object]'
  }

  // 是否為函式
  const ifFunction = (val) => {
    if (!['function', 'object'].includes(typeof val) || ifNull(val)) return false
    const objectType = {}.toString.call(val)
    return ['[object Function]', '[object GeneratorFunction]', '[object AsyncFunction]'].includes(objectType)
  }

  // 字串第一個字改大寫
  const upperFirst = (string) => {
    return string.slice(0, 1).toUpperCase() + string.slice(1)
  }

  // 檢查是否為字串
  const checkStr = (param) => {
    const {val, prefix} = param
    if (ifString(val)) return
    throw new Error(`${upperFirst(prefix)} should be a string`)
  }

  // 檢查是否為字串或未定義
  const checkStrOrUndefined = (param) => {
    const {val, prefix} = param
    if (ifString(val) || ifUndefined(val)) return
    throw new Error(`${upperFirst(prefix)} should be a string or undefined`)
  }

  // 檢查是否為函式
  const checkFn = (param) => {
    const {val, prefix} = param
    if (ifFunction(val)) return
    throw new Error(`${upperFirst(prefix)} should be a function`)
  }

  // 設置基本函式
  const setBasicMethodToSchema = (param) => {
    const {schema, scope} = param

    // 取得資訊
    schema.getInfo = () => {
      const {schema, input, rule, route, error, note} = scope
      return {schema, input, rule, route, error, note}
    }

    // 取得詳細資訊
    schema.getDetail = () => {
      const ret = {}

      for (let key in scope) {
        if (key.startsWith('_')) continue
        ret[key] = scope[key]
      }

      return ret
    }

    // 解析輸入值, 有被標記為錯誤時會停止解析, 最終會回傳資訊
    schema.parse = async (input, detailed) => {
      initScope({scope, input})

      const allRules = scope._getAllRules()

      for (const name in allRules) {
        const fn = allRules[name]

        if (scope.skip) {
          scope.skipRules.push(name)
          continue
        }

        if (scope.error) {
          scope.dismissalRules.push(name)
          continue
        }

        scope.rule = name
        await fn()
        scope.doneRules.push(name)
      }

      return detailed ? schema.getDetail() : schema.getInfo()
    }

    // 取得檢查類型
    schema.getType = () => {
      return scope.type
    }

    // 取得輸入值
    schema.getInput = () => {
      return scope.input
    }

    // 設置是否為必填
    schema.required = (val = true) => {
      scope.required = !!val
      return schema
    }

    // 取得是否為必填
    schema.getRequired = () => {
      return scope.required
    }

    // 設置是否跳過 parse 檢查
    schema.skip = (val = true) => {
      scope.isCustomSkip = true
      scope.skip = !!val
      return schema
    }

    // 取得是否跳過 parse 檢查
    schema.getSkip = () => {
      return scope.skip
    }

    // 設置預設值
    schema.default = (val) => {
      scope.default = val
      return schema
    }

    // 取得預設值
    schema.getDefault = () => {
      return scope.default
    }

    // 設置標籤 for 錯誤訊息顯示
    schema.label = (val) => {
      checkStr({val, prefix: 'Label'})
      scope.isCustomLabel = true
      scope.label = `${val}`
      return schema
    }

    // 取得標籤
    schema.getLabel = () => {
      return scope.label
    }

    // 設置警告訊息 for 錯誤訊息顯示
    schema.warning = (val) => {
      checkStr({val, prefix: 'Warning message'})
      scope.warning = `${val}`
      return schema
    }

    // 取得警告訊息
    schema.getWarning = () => {
      return scope.warning
    }

    // 設置註解
    schema.note = (val) => {
      checkStr({val, prefix: 'Note'})
      scope.note = `${val}`
      return schema
    }

    // 取得註解
    schema.getNote = () => {
      return scope.note
    }

    // 設置前置規則
    schema.insertPre = (val, name = 'insertPre') => {
      checkFn({val, prefix: 'Pre-rule'})
      scope._pre(name, async () => {
        await val(scope.helper)
      })
      return schema
    }

    // 設置後置規則
    schema.insertPost = (val, name = 'insertPost') => {
      checkFn({val, prefix: 'Post-rule'})
      scope._post(name, async () => {
        await val(scope.helper)
      })
      return schema
    }

    // 限定輸入值
    schema.allow = (...enums) => {
      scope._post('allow', async () => {
        await checkEnums({scope, enums})
      })
      return schema
    }

    // 不允許特定值
    schema.forbid = (...enums) => {
      scope._post('forbid', async () => {
        for (const check of enums) {
          const err = await inspect({scope, check, val: scope.input})
          if (err) continue

          const names = getNamesStrFromEnum({enums})
          scope._setErr(`{#label#} cannot be ${names}`)
          break
        }
      })
      return schema
    }
  }

  // 初使化通用參數
  const initScope = (param) => {
    const {scope, input} = param
    Object.assign(scope, {
      skip: scope.isCustomSkip ? scope.skip : false, // 是否跳過規則檢查
      input, // 輸入值
      rule: '', // 當下執行的規則
      route: '', // 當 input 為 Array/Object 時檢查的路徑
      routeRule: '', // 當 input 為 Array/Object 時檢查的路徑規則
      error: undefined, // 錯誤訊息
      doneRules: [], // 已執行的規則
      dismissalRules: [], // 因發生錯誤而未執行的規則
      skipRules: [], // 已跳過的的規則
    })
  }

  // 將列舉值轉換為名稱訊息
  const getNamesStrFromEnum = (param) => {
    const {enums} = param
    return enums.map((check) => {
      if (caroChecker.isSchema(check)) {
        const detail = check.getDetail()
        if (['Any', 'Array'].includes(detail.type)) return getNamesStrFromEnum({enums: detail.enums})
        return check.getType()
      }
      const val = caroChecker.isRef(check) ? check.val : check
      return ifUndefined(val) ? 'undefined' : JSON.stringify(val)
    }).join(' or ')
  }

  // 由列舉值轉換為錯誤訊息
  const convertEnumsToError = (param) => {
    const {scope, prefix, enums} = param
    const names = getNamesStrFromEnum({enums})
    scope._setErr(`${prefix} only accepts ${names}`)
  }

  // 從 schema 名稱取得類型
  const getTypeFromSchemaName = (param) => {
    const {name} = param
    return name.replace('Schema', '').toLowerCase()
  }

  // 取得操作物件
  const getSchemaInstance = (param) => {
    const {type, schemaOpts, pre, post} = param
    const schemaName = `${upperFirst(type)}Schema`

    // 設置通用參數
    const scope = {
      schema: schemaName, // 執行檢查的操作物件名稱
      type, // 檢查類型
      isCustomSkip: false, // 是否為外部設置的 skip 值
      isCustomLabel: false, // 是否為外部設置的 label 值
      label: 'the input', // 自定義標籤
      warning: undefined, // 自定義錯誤訊息
      default: undefined, // 預設值
      required: false, // input 是否必填
      preRules: {}, // 解析時會執行的前置規則
      mainRules: {}, // 解析時會執行的主規則
      postRules: {}, // 解析時會執行的後置規則
      // 取得所有規則
      _getAllRules: () => {
        return {...scope.preRules, ...scope.mainRules, ...scope.postRules}
      },
      // 設置錯誤訊息
      _setErr: (error) => {
        let msg

        if (scope.warning) msg = scope.warning
        else if (error) msg = error
        else msg = `{#label#} only accepts ${scope.type}`

        // 轉換訊息
        msg = msg.replace(new RegExp('\{#label#\}', 'ig'), scope.label)

        scope.error = msg
      },
      // 註冊主規則
      _main: (name, fn) => {
        scope.mainRules[name] = fn
      },
      // 註冊前置規則
      _pre: (name, fn) => {
        scope.preRules[name] = fn
      },
      // 註冊後置規則
      _post: (name, fn) => {
        scope.postRules[name] = fn
      },
      // 設置檢查路徑
      _setRoute: (route, connect = false) => {
        if (!route) return
        if (!connect) scope.route = `${route}`
        else scope.route += `${scope.route ? '.' : ''}${route}`
      },
      _extractRef: (arg) => {
        if (!caroChecker.isRef(arg)) return arg

        const rootHelper = helper.root || helper

        let val = rootHelper.getInput()
        for (const path of arg.pathArr) {
          if (ifUndefined(val)) break
          val = val[path]
        }

        return arg.val = val // 回寫取得的值
      },
    }

    initScope({scope})

    // 設置主規則
    scope._main('default', () => {
      if (scope.input === undefined) scope.input = scope.default
    })
    scope._main('require', () => {
      const isUndefined = ifUndefined(scope.input)
      if (!scope.required) {
        if (isUndefined) scope.skip = true // 沒有輸入值 -> 跳過後續的規則
        return
      }
      if (!isUndefined) return
      scope._setErr(`{#label#} is required`)
    })

    // 建立操作物件
    const schema = new schemaMap[schemaName]({scope, schemaOpts})
    setBasicMethodToSchema({schema, scope})

    // 設置助手物件
    const helper = new Helper({scope})
    setBasicMethodToSchema({schema: helper, scope})
    scope.helper = helper

    const allPre = {...caroChecker.preRule, ...pre}
    for (const name in allPre) {
      const fn = allPre[name]
      schema[name] = (...args) => {
        scope._pre(name, async () => {
          await fn(scope.helper, ...args)
        })
        return schema
      }
    }

    const allPost = {...caroChecker.postRule, ...post}
    for (const name in allPost) {
      const fn = allPost[name]
      schema[name] = (...args) => {
        scope._post(name, async () => {
          await fn(scope.helper, ...args)
        })
        return schema
      }
    }

    return schema
  }

  // 嘗試將 check 轉換為 schema/value
  const convertCheck = (param) => {
    const {scope, check} = param
    if (caroChecker.isSchema(check)) return check

    const val = scope.helper.extractRef(check)

    if (ifObject(val)) return caroChecker.object(val).required()
    if (ifArray(val)) return caroChecker.any(...val).required()

    return val
  }

  // 執行檢查
  const inspect = async (param) => {
    const {scope, check, val, field = undefined, insertRootHelper = false, forceRequired = false} = param

    scope._setRoute(field)

    const checkVal = convertCheck({scope, check})

    if (!caroChecker.isSchema(checkVal)) {
      if (checkVal === val) return
      return `${field || '{#label#}'} only accepts ${JSON.stringify(checkVal)}`
    }

    const detail = checkVal.getDetail()

    if (!detail.isCustomLabel && field) checkVal.label(field)
    if (insertRootHelper) detail.helper.root = scope.helper.root || scope.helper
    if (forceRequired) checkVal.required()

    const subInfo = await checkVal.parse(val, true)

    if (!ifUndefined(field)) scope.input[field] = subInfo.input // input 值可能會轉換

    scope._setRoute(subInfo.route, true)
    scope.routeRule = subInfo.rule

    return subInfo.error
  }

  // 檢查輸入值是否符合列舉值
  const checkEnums = async (param) => {
    const {scope, enums} = param

    for (const check of enums) {
      const err = await inspect({scope, check, val: scope.input})
      if (!err) return
    }

    convertEnumsToError({prefix: `{#label#}`, scope, enums})
  }

  // 操作物件表
  const schemaMap = {
    AnySchema, StringSchema, NumberSchema, BooleanSchema, ObjectSchema, ArraySchema,
  }

  // 操作件物名稱列表
  const schemaNames = Object.keys(schemaMap)

  // 輔助物件
  function Helper (param) {
    const {scope} = param
    const helper = this

    // 設置輸入值
    helper.input = (val) => {
      scope.input = val
    }

    // 嘗試從指向物件取得指定欄位的值
    helper.extractRef = (arg) => {
      return scope._extractRef(arg)
    }

    // 標記為錯誤
    helper.markError = (val) => {
      checkStrOrUndefined({val, prefix: 'Error message'})
      scope._setErr(val)
    }

    // 解析傳入的 schema
    helper.parseSchema = async (check, detailed) => {
      if (!caroChecker.isSchema(check)) throw new Error('Please input schema for parsing')
      if (check === helper) throw new Error('Cannot parse schema itself')

      const err = await inspect({check, scope, val: scope.input})
      if (err) scope._setErr(err)

      return detailed ? helper.getDetail() : helper.getInfo()
    }
  }

  // 任意值操作物件
  function AnySchema (param) {
    const {scope, schemaOpts: enums = []} = param
    // const schema = this
    const name = 'any'

    scope.enums = enums

    // 預設檢查
    scope._post(name, async () => {
      if (ifUndefined(enums) || enums.length < 1) return
      await checkEnums({scope, enums})
    })
  }

  // String 操作物件
  function StringSchema (param) {
    const {scope} = param
    const schema = this
    const name = 'string'

    // 預設檢查
    scope._post(name, () => {
      if (ifString(scope.input)) return
      scope._setErr()
    })

    // 檢查長度
    schema.size = (limit) => {
      scope._post('size', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if (input.length === limit) return
        scope._setErr(`{#label#} size should be ${limit}`)
      })

      return schema
    }

    // 檢查最小長度
    schema.min = (limit) => {
      scope._post('min', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if (input.length >= limit) return
        scope._setErr(`{#label#} size cannot be less than ${limit}`)
      })

      return schema
    }

    // 檢查最大長度
    schema.max = (limit) => {
      scope._post('max', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if (input.length <= limit) return
        scope._setErr(`{#label#} size cannot be greater than ${limit}`)
      })

      return schema
    }
  }

  // Number 操作物件
  function NumberSchema (param) {
    const {scope} = param
    const schema = this
    const name = 'number'

    // 預設為非嚴格模式
    scope.strict = false

    // 預設檢查
    scope._post(name, () => {
      let number = scope.input

      // 嘗試轉 number
      if (!scope.strict && ifString(number) && number !== '') number = Number(scope.input)

      if (ifNumber(number)) return scope.input = number
      scope._setErr()
    })

    // 檢查最小值
    schema.min = (limit, exclude = false) => {
      scope._post('min', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if ((!exclude && input >= limit) || (exclude && input > limit)) return
        scope._setErr(`{#label#} should be${!exclude ? ' equal to or ' : ' '}greater than ${limit}`)
      })

      return schema
    }

    // 檢查最大值
    schema.max = (limit, exclude = false) => {
      scope._post('max', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if ((!exclude && input <= limit) || (exclude && input < limit)) return
        scope._setErr(`{#label#} should be${!exclude ? ' equal to or ' : ' '}less than ${limit}`)
      })

      return schema
    }

    // 設置是否為嚴格模式
    schema.strict = (val = true) => {
      scope.strict = !!val
      return schema
    }
  }

  // Boolean 操作物件
  function BooleanSchema (param) {
    const {scope} = param
    const schema = this
    const name = 'boolean'

    // 預設為非嚴格模式
    scope.strict = false

    // 預設檢查
    scope._post(name, () => {
      let boolean = scope.input

      // 嘗試轉 boolean
      if (!scope.strict) {
        if (ifNumber(boolean)) boolean = String(boolean)
        if (ifString(boolean)) {
          boolean = boolean.toUpperCase()
          if (['TRUE', '1'].includes(boolean)) boolean = true
          else if (['FALSE', '0'].includes(boolean)) boolean = false
        }
      }

      if (ifBoolean(boolean)) return scope.input = boolean
      scope._setErr()
    })

    // 設置是否為嚴格模式
    schema.strict = (val = true) => {
      scope.strict = !!val
      return schema
    }
  }

  // Array 操作物件
  function ArraySchema (param) {
    const {scope, schemaOpts: enums = []} = param
    const schema = this
    const name = 'array'

    scope.enums = enums

    // 預設檢查
    scope._post(name, async () => {
      if (!ifArray(scope.input)) return scope._setErr()
      if (ifUndefined(enums) || enums.length < 1) return

      let allPass = true

      for (let i in scope.input) {
        const val = scope.input[i]

        let gotPass = false
        for (let check of enums) {
          const err = await inspect({check, scope, val, field: i, forceRequired: true})
          if (err) continue

          gotPass = true
          break
        }
        if (gotPass) continue

        allPass = false
        break
      }

      if (!allPass) convertEnumsToError({prefix: `the array-element in {#label#}`, scope, enums})
    })

    // 檢查長度
    schema.size = (limit) => {
      scope._post('size', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if (input.length === limit) return
        scope._setErr(`{#label#} size should be ${limit}`)
      })

      return schema
    }

    // 檢查最小長度
    schema.min = (limit) => {
      scope._post('min', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if (input.length >= limit) return
        scope._setErr(`{#label#} size cannot be less than ${limit}`)
      })

      return schema
    }

    // 檢查最大長度
    schema.max = (limit) => {
      scope._post('max', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if (input.length <= limit) return
        scope._setErr(`{#label#} size cannot be greater than ${limit}`)
      })

      return schema
    }
  }

  // Object 操作物件
  function ObjectSchema (param) {
    let {scope, schemaOpts: [plan = {}]} = param
    const schema = this
    const name = 'object'

    // 設置規則表
    scope.plan = plan

    // 預設檢查
    scope._post(name, async () => {
      if (!ifObject(scope.input)) return scope._setErr()

      for (const field in plan) {
        const check = plan[field]
        const val = scope.input[field]

        const err = await inspect({check, scope, val, field, insertRootHelper: true})

        if (!err) continue
        scope._setErr(err)

        break
      }
    })

    // 檢查長度
    schema.size = (limit) => {
      scope._post('size', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if (Object.keys(input).length === limit) return
        scope._setErr(`{#label#} size should be ${limit}`)
      })

      return schema
    }

    // 檢查最小長度
    schema.min = (limit) => {
      scope._post('min', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if (Object.keys(input).length >= limit) return
        scope._setErr(`{#label#} size cannot be less than ${limit}`)
      })

      return schema
    }

    // 檢查最大長度
    schema.max = (limit) => {
      scope._post('max', () => {
        const input = scope.input

        limit = scope._extractRef(limit) || 1

        if (Object.keys(input).length <= limit) return
        scope._setErr(`{#label#} size cannot be greater than ${limit}`)
      })

      return schema
    }
  }

  // 指向物件
  function Ref (fieldPath) {
    if (!ifString(fieldPath) || !fieldPath) throw new Error('Please assign valid fieldPath for Ref')
    this.pathArr = fieldPath.split('.')
  }

  // 開始設置主函式
  function CaroChecker () {
    // 取得指向物件
    this.ref = (fieldPath) => {
      return new Ref(fieldPath)
    }

    // 是否為指向物件
    this.isRef = (arg) => {
      if (!ifObject(arg)) return false

      const constructor = arg.constructor
      if (!constructor) return false

      const className = Object.getPrototypeOf(constructor).name || constructor.name
      return className === 'Ref' && ifArray(arg.pathArr) && arg.pathArr.length > 0
    }

    // 是否為操作物件
    this.isSchema = (arg, type = undefined) => {
      if (!ifObject(arg)) return false

      const constructor = arg.constructor
      if (!constructor) return false

      const className = Object.getPrototypeOf(constructor).name || constructor.name
      return schemaNames.includes(className) && (type ? getTypeFromSchemaName({name: className}) === type.toLowerCase() : true)
    }
  }

  const caroChecker = new CaroChecker()

  for (const name of schemaNames) {
    const type = getTypeFromSchemaName({name})
    caroChecker[type] = (...schemaOpts) => {
      return getSchemaInstance({type: upperFirst(type), schemaOpts, pre, post})
    }
    const pre = caroChecker[type].preRule = {}
    const post = caroChecker[type].postRule = {}
  }

  caroChecker.preRule = {}
  caroChecker.postRule = {}

  const isNode = new Function('try{return this===global;}catch(e){return false;}')
  if (isNode) {
    module.exports = caroChecker
    return
  }
  g.caroChecker = caroChecker
})(this)
