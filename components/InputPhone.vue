<template>
  <input
    v-model="phone"
    type="tel"
    placeholder="Ваш телефон"
    required="true"
    @focus.prevent="focusPhone"
    @blur="blurPhone"
    @input="formatPhone"
  />
</template>

<script>
export default {
  data: () => {
    return {
      phone: '',
      phoneRegex: /^[+](7)(\s)[(]/,
    }
  },
  methods: {
    focusPhone(e) {
      if (this.phone === '') {
        this.phone = '+7 ('
      }
    },
    blurPhone() {
      if (this.phone.length < 5) {
        this.phone = ''
      }
    },
    formatPhone(e) {
      let phoneStr = this.phone.replace(/\D/g, '')
      if (!this.phone.match(this.phoneRegex) && e.target.selectionStart > 4) {
        this.phone = '+7 (' + this.phone.substring(4, 18)
      } else if (e.target.selectionStart < 3) {
        phoneStr += phoneStr.charAt(0)
        phoneStr = phoneStr.substring(1)
      }
      if (isNaN(e.data) || e.data === ' ' || phoneStr.length > 11) {
        this.phone = this.phone.replace(/.$/, '')
      } else if (phoneStr.length > 9) {
        this.phone =
          '+7 (' +
          phoneStr.substring(1, 4) +
          ') ' +
          phoneStr.substring(4, 7) +
          '-' +
          phoneStr.substring(7, 9) +
          '-' +
          phoneStr.substring(9, 11)
      } else if (
        phoneStr.length > 8 &&
        e.inputType === 'deleteContentBackward'
      ) {
        this.phone =
          '+7 (' +
          phoneStr.substring(1, 4) +
          ') ' +
          phoneStr.substring(4, 7) +
          '-' +
          phoneStr.substring(7, 9)
      } else if (phoneStr.length > 8) {
        this.phone =
          '+7 (' +
          phoneStr.substring(1, 4) +
          ') ' +
          phoneStr.substring(4, 7) +
          '-' +
          phoneStr.substring(7, 9) +
          '-'
      } else if (phoneStr.length > 7) {
        this.phone =
          '+7 (' +
          phoneStr.substring(1, 4) +
          ') ' +
          phoneStr.substring(4, 7) +
          '-' +
          phoneStr.substring(7, 9)
      } else if (
        phoneStr.length > 6 &&
        e.inputType === 'deleteContentBackward'
      ) {
        this.phone =
          '+7 (' + phoneStr.substring(1, 4) + ') ' + phoneStr.substring(4, 7)
      } else if (phoneStr.length > 6) {
        this.phone =
          '+7 (' +
          phoneStr.substring(1, 4) +
          ') ' +
          phoneStr.substring(4, 7) +
          '-'
      } else if (phoneStr.length > 4) {
        this.phone =
          '+7 (' + phoneStr.substring(1, 4) + ') ' + phoneStr.substring(4, 7)
      } else if (
        phoneStr.length > 3 &&
        e.inputType === 'deleteContentBackward'
      ) {
        this.phone = '+7 (' + phoneStr.substring(1, 4)
      } else if (phoneStr.length > 3) {
        this.phone = '+7 (' + phoneStr.substring(1, 4) + ') '
      } else {
        this.phone = '+7 (' + phoneStr.substring(1, 4)
      }
      this.$store.dispatch('setPhone', this.phone.replace(/\D/g, ''))
    },
  },
}
</script>
