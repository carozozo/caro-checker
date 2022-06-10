describe(__filename, () => {
  describe(`preRule - 自定義全 schema 通用前置規則`, async () => {
    it(`preRule.printLog - 印出紀錄`, async () => {
      let count = 0

      cc.preRule.printInput = () => {
        // print log or do anything you want
        count++
      }

      const input = {name: 'Caro', age: 18}
      await cc.object({
        name: cc.string().printInput().required(),
        age: cc.number().printInput().required(),
      }).parse(input)
      assert.strictEqual(count, 2)
    })
  })

  describe(`postRule - 自定義全 schema 通用後置規則`, async () => {
  })

  describe(`trimStr() - 支援字串移除前後空白`, async () => {
    cc.trimStr = () => {
      return cc.string().insertPre((helper) => {
        const input = helper.getInput()

        if (!_.isString(input)) return

        return helper.input(input.trim())
      }, 'trimStr')
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

  describe(`arrayLike({separator = ',', toNum = true} = {}) - 支援字串轉陣列`, async () => {
    cc.arrayLike = ({separator = ',', toNum = false} = {}) => {
      return cc.array().insertPre((helper) => {
        let input = helper.getInput()

        helper.warning(`{#label#} only accepts array or array-like string`)

        if (!_.isString(input)) return
        const arr = input.split(separator).map((v) => {
          v = v.trim()
          return toNum ? Number(v) : v
        })
        helper.input(arr)
      }, 'arrayLike')
    }

    const errMsg = `the input only accepts array or array-like string`

    describe(`arrayLike()`, async () => {
      it(`通過: '1,2, 3'`, async () => {
        const input = '1,2, 3'
        const info = await cc.arrayLike().parse(input, true)
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

    describe(`arrayLike({separator: ';'}) - 以";"分隔轉為陣列`, async () => {
      it(`通過: '1;2;3'`, async () => {
        const input = '1;2;3'
        const info = await cc.arrayLike({separator: ';'}).parse(input)
        assert.strictEqual(_.isArray(info.input), true)
        assert.strictEqual(info.input.length, 3)
        assert.strictEqual(info.input[0], '1')
        assert.strictEqual(info.input[1], '2')
        assert.strictEqual(info.input[2], '3')
        assert.strictEqual(info.error, undefined)
      })
    })

    describe(`arrayLike({toNum: true}) - 轉為數字陣列`, async () => {
      it(`通過: '1,2,3'`, async () => {
        const input = '1,2,3'
        const info = await cc.arrayLike({toNum: true}).parse(input)
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
