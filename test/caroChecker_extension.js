describe(__filename, () => {
  describe(`booleanLike() - 支援字串轉布林值`, async () => {
    cc.booleanLike = () => {
      return cc.boolean().convert((helper) => {
        let input = helper.getInput()

        helper.warning(errMsg)

        if (!_.isString(input)) return input

        input = input.toUpperCase()
        if (['TRUE', '1'].includes(input)) input = true
        else if (['FALSE', '0'].includes(input)) input = false
        return input
      })
    }

    const errMsg = `the input only accepts boolean or boolean-like string`

    describe(`booleanLike()`, async () => {
      it(`通過: 'true'`, async () => {
        const input = 'true'
        const info = await cc.booleanLike().parse(input)
        assert.strictEqual(info.input, true)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: '123'`, async () => {
        const input = '123'
        const info = await cc.booleanLike().parse(input)
        assert.strictEqual(info.input, input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`trimStr() - 支援字串移除前後空白`, async () => {
    cc.trimStr = () => {
      return cc.string().convert((helper) => {
        const input = helper.getInput()

        if (!_.isString(input)) return input

        return input.trim()
      })
    }

    const errMsg = `the input size cannot be greater than 4`

    describe(`trimStr().max(4)`, async () => {
      it(`通過: {name: 'Caro  '}`, async () => {
        const input = 'Caro  '
        const info = await cc.trimStr().max(4).parse(input)
        assert.strictEqual(info.input, _.trim(input))
        assert.strictEqual(info.error, undefined)
      })

      it(`不通過: {name: 'Caro1  '}`, async () => {
        const input = `Caro1  `
        const info = await cc.trimStr().max(4).parse(input)
        assert.strictEqual(info.input, _.trim(input))
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`numberLike() - 支援字串轉數字`, async () => {
    cc.numberLike = () => {
      return cc.number().convert((helper) => {
        let input = helper.getInput()

        helper.warning(errMsg)

        if (!_.isString(input)) return input

        const number = Number(input)
        if (Number.isNaN(number)) return input

        return number
      })
    }

    const errMsg = `the input only accepts number or number-like string`

    describe(`numberLike()`, async () => {
      it(`通過: '123'`, async () => {
        const input = '123'
        const info = await cc.numberLike().parse(input)
        assert.strictEqual(info.input, 123)
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 'caro'`, async () => {
        const input = 'caro'
        const info = await cc.numberLike().parse(input)
        assert.strictEqual(info.input, input)
        assert.strictEqual(info.error, errMsg)
      })
    })
  })

  describe(`arrayLike([toNum = false]) - 支援字串轉陣列`, async () => {
    cc.arrayLike = (toNum = false) => {
      return cc.array().convert((helper) => {
        let input = helper.getInput()

        helper.warning(errMsg)

        if (!_.isString(input)) return input

        return input.split(',').map((v) => {
          v = v.trim()
          if (toNum) v = Number(v)
          return v
        })
      })
    }

    const errMsg = `the input only accepts array or array-like string`

    describe(`arrayLike()`, async () => {
      it(`通過: '1,2, 3'`, async () => {
        const input = '1,2, 3'
        const info = await cc.arrayLike().parse(input)
        assert.strictEqual(_.isArray(info.input), true)
        assert.strictEqual(info.input.length, 3)
        assert.strictEqual(info.input[0], '1')
        assert.strictEqual(info.input[1], '2')
        assert.strictEqual(info.input[2], '3')
        assert.strictEqual(info.error, undefined)
      })
      it(`不通過: 123`, async () => {
        const input = 123
        const info = await cc.arrayLike().parse(input)
        assert.strictEqual(_.isArray(info.input), false)
        assert.strictEqual(info.error, errMsg)
      })
    })
    describe(`arrayLike(true)`, async () => {
      it(`通過: '1,2, 3' 並轉為數字陣列`, async () => {
        const input = '1,2, 3'
        const info = await cc.arrayLike(true).parse(input)
        assert.strictEqual(_.isArray(info.input), true)
        assert.strictEqual(info.input.length, 3)
        assert.strictEqual(info.input[0], 1)
        assert.strictEqual(info.input[1], 2)
        assert.strictEqual(info.input[2], 3)
        assert.strictEqual(info.error, undefined)
      })
    })
  })
})
