describe(__filename, () => {
  describe(`object().together(setting = {keys = [], warning}, [...setting]) - 指定欄位需同時存在或不存在`, async () => {
    cc.object.postRule.together = (helper, ...settings) => {
      const input = helper.getInput()

      for (const k in input) {
        if (input[k] === undefined) delete input[k]
      }

      const allKeys = Object.keys(input)

      for (let {keys, warning} of settings) {
        helper.note(`${keys.join(',')}`)

        const firstKey = keys[0]
        const firstHasKey = allKeys.includes(firstKey)

        let errKey = ''
        for (const key of keys) {
          const hasKey = allKeys.includes(key)
          if (firstHasKey && hasKey) continue
          if (!firstHasKey && !hasKey) continue
          errKey = key
        }

        if (!errKey) continue

        if (!warning) warning = `${keys.join(', ')} should present together`

        helper.markError(warning)
        break
      }
    }

    describe(`object().together({keys: ['a', 'b']})`, async () => {
      const plan = {a: cc.boolean(), b: cc.boolean()}
      const setting = {keys: ['a', 'b']}

      it(`通過: {a: true, b: true}`, async () => {
        const input = {a: true, b: true}
        const info = await cc.object(plan).together(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {}`, async () => {
        const input = {}
        const info = await cc.object(plan).together(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: true}`, async () => {
        const input = {a: true}
        const info = await cc.object(plan).together(setting).parse(input)
        assert.strictEqual(info.note, `a,b`)
        assert.strictEqual(info.error, `a, b should present together`)
      })
      it(`不通過: {b: true}`, async () => {
        const input = {b: true}
        const info = await cc.object(plan).together(setting).parse(input)
        assert.strictEqual(info.note, `a,b`)
        assert.strictEqual(info.error, `a, b should present together`)
      })
    })

    describe(`object().together({keys: ['a', 'b']}, {keys: ['c', 'd']})`, async () => {
      const plan = {a: cc.boolean(), b: cc.boolean()}
      const setting = {keys: ['a', 'b']}
      const setting2 = {keys: ['c', 'd']}

      it(`通過: {a: true, b: true, c: true, d: true}`, async () => {
        const input = {a: true, b: true, c: true, d: true}
        const info = await cc.object(plan).together(setting, setting2).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {a: true, b: true}`, async () => {
        const input = {a: true, b: true}
        const info = await cc.object(plan).together(setting, setting2).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: true, b: true, c: true}`, async () => {
        const input = {a: true, b: true, c: true}
        const info = await cc.object(plan).together(setting, setting2).parse(input)
        assert.strictEqual(info.note, `c,d`)
        assert.strictEqual(info.error, `c, d should present together`)
      })
      it(`不通過: {a: true, b: true, d: true}`, async () => {
        const input = {a: true, b: true, d: true}
        const info = await cc.object(plan).together(setting, setting2).parse(input)
        assert.strictEqual(info.note, `c,d`)
        assert.strictEqual(info.error, `c, d should present together`)
      })
    })
  })

  describe(`object().scoop(setting = {keys = [], min = 1, max = keys.length, warning}, [...setting]) - 指定欄位中需要存在的數量範圍`, async () => {
    cc.object.postRule.scoop = (helper, ...settings) => {
      const {plan} = helper.getDetail()
      const input = helper.getInput()

      for (const k in input) {
        if (input[k] === undefined) delete input[k]
      }

      const inputKeys = Object.keys(input)
      const defKeys = Object.keys(plan) || inputKeys

      for (let {keys = defKeys, min = 1, max = keys.length, warning} of settings) {
        const amount = keys.length
        let keyCount = 0

        min = helper.extractRef(min)
        max = helper.extractRef(max)

        if (min < 1) min = 1
        else if (min > amount) min = amount

        if (max < 1) max = 1
        else if (max > amount) max = amount

        if (max < min) max = min

        helper.note(keys.join(','))

        for (const key of keys) {
          if (inputKeys.includes(key)) keyCount++
        }

        if (keyCount >= min && keyCount <= max) continue

        if (!warning) {
          const beVerb = min === max && min === 1 ? `is` : `are`
          const range = min === max ? `${min}` : `${min}~${max}`
          const among = amount > 2 ? `among` : `between`
          warning = `there ${beVerb} ${range} required ${among} ${keys.join(', ')}`
        }

        helper.markError(warning)
        break
      }
    }

    describe(`object({a: cc.boolean(), b: cc.boolean()}).scoop({})`, async () => {
      const plan = {a: cc.boolean(), b: cc.boolean()}
      const setting = {}

      it(`通過: {a: true}`, async () => {
        const input = {a: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {b: true}`, async () => {
        const input = {b: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {a: true, b: true}`, async () => {
        const input = {a: true, b: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {}`, async () => {
        const input = {}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.note, `a,b`)
        assert.strictEqual(info.error, `there are 1~2 required between a, b`)
      })
    })

    describe(`object({a: cc.boolean(), b: cc.boolean(), c: cc.boolean()}).scoop({keys:['a', 'b']})`, async () => {
      const plan = {a: cc.boolean(), b: cc.boolean(), c: cc.boolean()}
      const setting = {keys: ['a', 'b']}

      it(`通過: {a: true}`, async () => {
        const input = {a: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {b: true}`, async () => {
        const input = {b: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {a: true, c: true}`, async () => {
        const input = {a: true, c: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {c: true}`, async () => {
        const input = {c: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.note, `a,b`)
        assert.strictEqual(info.error, `there are 1~2 required between a, b`)
      })
    })

    describe(`object({a: cc.boolean(), b: cc.boolean(), c: cc.boolean()}).scoop({min: 2})`, async () => {
      const plan = {a: cc.boolean(), b: cc.boolean(), c: cc.boolean()}
      const setting = {min: 2}

      it(`通過: {a: true, b: true, c: true}`, async () => {
        const input = {a: true, b: true, c: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`通過: {a: true, b: true}`, async () => {
        const input = {a: true, b: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: true}`, async () => {
        const input = {a: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.note, `a,b,c`)
        assert.strictEqual(info.error, `there are 2~3 required among a, b, c`)
      })
    })

    describe(`object({a: cc.boolean(), b: cc.boolean(), c: cc.boolean()}).scoop({min: 2, max: 2})`, async () => {
      const plan = {a: cc.boolean(), b: cc.boolean(), c: cc.boolean()}
      const setting = {min: 2, max: 2}

      it(`通過: {a: true, b: true}`, async () => {
        const input = {a: true, b: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: {a: true}`, async () => {
        const input = {a: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.note, `a,b,c`)
        assert.strictEqual(info.error, `there are 2 required among a, b, c`)
      })
      it(`不通過: {a: true, b: true, c: true}`, async () => {
        const input = {a: true, b: true, c: true}
        const info = await cc.object(plan).scoop(setting).parse(input)
        assert.strictEqual(info.note, `a,b,c`)
        assert.strictEqual(info.error, `there are 2 required among a, b, c`)
      })
    })
  })
})

