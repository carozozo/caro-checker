describe(__filename, () => {
  describe(`支援縣市行政區檢查`, async () => {
    cc.object.postRule.address = async (helper) => {
      const addressMap = await (function getAddressMapFromDb () {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({A: ['a1', 'a2', 'a3'], B: ['b1', 'b2', 'b3'], C: ['c1', 'c2', 'c3']})
          }, 1)
        })
      })()
      const countyEnums = _.keys(addressMap)
      const input = helper.getInput()
      await helper.parseSchema(cc.object({
        county: cc.any(...countyEnums),
        district: cc.any(...addressMap[input.county]),
      }))
    }

    it(`通過: {county: 'A', district: 'a1'}`, async () => {
      const input = {county: 'A', district: 'a1'}
      const info = await cc.object().address().parse(input)
      assert.strictEqual(info.error, undefined)
    })
    it(`不通過: {county: 'A', district: 'b1'}`, async () => {
      const input = {county: 'A', district: 'b1'}
      const info = await cc.object().address().parse(input)
      assert.strictEqual(info.error, `district only accepts "a1" or "a2" or "a3"`)
    })
    it(`不通過: {county: 'B', district: 'c1'}`, async () => {
      const input = {county: 'B', district: 'c1'}
      const info = await cc.object().address().parse(input)
      assert.strictEqual(info.error, `district only accepts "b1" or "b2" or "b3"`)
    })
  })

  describe(`跨欄位判斷必填`, async () => {
    const warningA = 'fieldA is required while group is 1'
    const warningB = 'fieldB is required while group is 2'
    const plan = {
      group: cc.any(1, 2).required(),
      bio: {
        fieldA: cc.string().warning(warningA).insertPre((helper) => {
          helper.required(helper.root.getInput().group === 1)
        }),
        fieldB: cc.string().warning(warningB).insertPre((helper) => {
          helper.required(helper.root.getInput().group === 2)
        }),
      },
    }

    it(`通過: {group: 1, fieldA: ''}`, async () => {
      const input = {group: 1, bio: {fieldA: ''}}
      const info = await cc.object(plan).parse(input)
      assert.strictEqual(info.error, undefined)
    })
    it(`不通過: {group: 1, fieldA: undefined}`, async () => {
      const input = {group: 1, bio: {fieldA: undefined}}
      const info = await cc.object(plan).parse(input)
      assert.strictEqual(info.error, warningA)
    })
    it(`不通過: {group: 2, fieldB: undefined}`, async () => {
      const input = {group: 2, bio: {fieldB: undefined}}
      const info = await cc.object(plan).parse(input)
      assert.strictEqual(info.error, warningB)
    })
  })

  describe(`動態欄位型態檢查`, async () => {
    const plan = {
      type: cc.any('string', 'number').required(),
      value: cc.any().insertPre(async (helper) => {
        const type = helper.root.getInput().type
        let schema

        if (type === 'string') schema = cc.string()
        else if (type === 'number') schema = cc.number().strict()

        await helper.parseSchema(schema.required())
      }),
    }

    it(`通過: {type: 'string', value: '3'}`, async () => {
      const input = {type: 'string', value: '3'}
      const info = await cc.object(plan).parse(input)
      assert.strictEqual(info.error, undefined)
    })
    it(`通過: {type: 'number', value: 3}`, async () => {
      const input = {type: 'number', value: 3}
      const info = await cc.object(plan).parse(input)
      assert.strictEqual(info.error, undefined)
    })
    it(`不通過: {type: 'string', value: 3}`, async () => {
      const input = {type: 'string', value: 3}
      const info = await cc.object(plan).parse(input)
      assert.strictEqual(info.error, 'the input only accepts String')
    })
    it(`不通過: {type: 'number', value: '3'}`, async () => {
      const input = {type: 'number', value: '3'}
      const info = await cc.object(plan).parse(input)
      assert.strictEqual(info.error, 'the input only accepts Number')
    })
  })
})

