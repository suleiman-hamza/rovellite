<script setup lang="ts">
definePageMeta({
  title: 'Settings',
  layout: 'admin',
  keepalive: true,
})

type SettingsSection = 'general' | 'security' | 'payment' | 'api' | 'services' | 'notification' | 'account'

const activeSection = ref<SettingsSection>('general')

const navItems: { key: SettingsSection, label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'security', label: 'Security' },
  { key: 'payment', label: 'Payment' },
  { key: 'api', label: 'API & Integration' },
  { key: 'services', label: 'Services' },
  { key: 'notification', label: 'Notification' },
  { key: 'account', label: 'Account' },
]

interface GeneralSettings {
  platformName: string
  supportEmail: string
  contactNumber: string
  defaultCurrency: string
  timeZone: string
  platformStatus: string
}

const settings = ref<GeneralSettings>({
  platformName: '',
  supportEmail: '',
  contactNumber: '',
  defaultCurrency: '',
  timeZone: '',
  platformStatus: 'Maintenance',
})

const editingFields = ref<Set<keyof GeneralSettings>>(new Set())

function toggleEdit(field: keyof GeneralSettings) {
  if (editingFields.value.has(field)) {
    editingFields.value.delete(field)
  }
  else {
    editingFields.value.add(field)
  }
  editingFields.value = new Set(editingFields.value)
}

function isEditing(field: keyof GeneralSettings) {
  return editingFields.value.has(field)
}

const platformStatusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Inactive', value: 'inactive' },
]

interface SecuritySettings {
  twoFactorAuth: boolean
  loginAlert: boolean
  timeOut: boolean
}

const security = ref<SecuritySettings>({
  twoFactorAuth: true,
  loginAlert: true,
  timeOut: true,
})

interface PaymentSettings {
  walletFunding: boolean
  walletPayment: boolean
  paystackPayment: boolean
  transactionCharges: string
  minimumFunding: string
}

const payment = ref<PaymentSettings>({
  walletFunding: true,
  walletPayment: true,
  paystackPayment: true,
  transactionCharges: '10%',
  minimumFunding: '#100',
})

const editingPaymentFields = ref<Set<keyof Pick<PaymentSettings, 'transactionCharges' | 'minimumFunding'>>>(new Set())

function togglePaymentEdit(field: 'transactionCharges' | 'minimumFunding') {
  if (editingPaymentFields.value.has(field)) {
    editingPaymentFields.value.delete(field)
  }
  else {
    editingPaymentFields.value.add(field)
  }
  editingPaymentFields.value = new Set(editingPaymentFields.value)
}

function isEditingPayment(field: 'transactionCharges' | 'minimumFunding') {
  return editingPaymentFields.value.has(field)
}

const toast = useToast()

function handleUpdate() {
  editingFields.value = new Set()
  toast.add({
    title: 'Settings updated successfully!',
    color: 'success',
    icon: 'i-lucide-circle-check',
  })
}
</script>

<template>
  <main class="p-4 bg-white rounded-[20px]">
    <h2 class="text-[#34383D] text-[20px] font-bold leading-[150%] tracking-[2%] mb-6">
      Settings
    </h2>
    <div class="flex gap-6">
      <!-- Sidebar -->
      <aside class="w-48 shrink-0">
        <nav class="flex flex-col gap-1">
          <button
            v-for="item in navItems"
            :key="item.key"
            class="text-left px-4 py-2.5 rounded-[8px] text-[15px] font-medium transition-colors"
            :class="activeSection === item.key
              ? 'bg-[#DBF4FF] text-[#34383D] font-semibold'
              : 'text-[#9CA3AF] hover:text-[#34383D] hover:bg-gray-50'"
            @click="activeSection = item.key"
          >
            {{ item.label }}
          </button>
        </nav>
      </aside>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- General Section -->
        <template v-if="activeSection === 'general'">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-[#34383D] text-[20px] font-bold">
              General
            </h3>
            <UButton
              label="Update"
              color="primary"
              :ui="{ base: 'rounded-full px-8 py-2.5', label: 'font-semibold text-[16px]' }"
              @click="handleUpdate"
            />
          </div>

          <div class="flex flex-col gap-5">
            <!-- Platform Name -->
            <div>
              <label class="block text-[#34383D] text-[15px] font-medium mb-1.5">Platform Name</label>
              <div class="flex gap-2 items-center">
                <UInput
                  v-model="settings.platformName"
                  placeholder="werunfjjak11"
                  :disabled="!isEditing('platformName')"
                  class="flex-1"
                  :ui="{ base: 'rounded-[8px] py-2.5 px-4 disabled:bg-white disabled:cursor-default' }"
                />
                <UButton
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="outline"
                  :ui="{ base: 'rounded-[8px] p-2.5', leadingIcon: 'size-5' }"
                  @click="toggleEdit('platformName')"
                />
              </div>
            </div>

            <!-- Support Email -->
            <div>
              <label class="block text-[#34383D] text-[15px] font-medium mb-1.5">Support Email</label>
              <div class="flex gap-2 items-center">
                <UInput
                  v-model="settings.supportEmail"
                  placeholder="werunfjjak11"
                  :disabled="!isEditing('supportEmail')"
                  class="flex-1"
                  :ui="{ base: 'rounded-[8px] py-2.5 px-4 disabled:bg-white disabled:cursor-default' }"
                />
                <UButton
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="outline"
                  :ui="{ base: 'rounded-[8px] p-2.5', leadingIcon: 'size-5' }"
                  @click="toggleEdit('supportEmail')"
                />
              </div>
            </div>

            <!-- Contact Number -->
            <div>
              <label class="block text-[#34383D] text-[15px] font-medium mb-1.5">Contact Number</label>
              <div class="flex gap-2 items-center">
                <UInput
                  v-model="settings.contactNumber"
                  placeholder="werunfjjak11"
                  :disabled="!isEditing('contactNumber')"
                  class="flex-1"
                  :ui="{ base: 'rounded-[8px] py-2.5 px-4 disabled:bg-white disabled:cursor-default' }"
                />
                <UButton
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="outline"
                  :ui="{ base: 'rounded-[8px] p-2.5', leadingIcon: 'size-5' }"
                  @click="toggleEdit('contactNumber')"
                />
              </div>
            </div>

            <!-- Default Currency -->
            <div>
              <label class="block text-[#34383D] text-[15px] font-medium mb-1.5">Default Currency</label>
              <div class="flex gap-2 items-center">
                <UInput
                  v-model="settings.defaultCurrency"
                  placeholder="werunfjjak11"
                  :disabled="!isEditing('defaultCurrency')"
                  class="flex-1"
                  :ui="{ base: 'rounded-[8px] py-2.5 px-4 disabled:bg-white disabled:cursor-default' }"
                />
                <UButton
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="outline"
                  :ui="{ base: 'rounded-[8px] p-2.5', leadingIcon: 'size-5' }"
                  @click="toggleEdit('defaultCurrency')"
                />
              </div>
            </div>

            <!-- Time Zone -->
            <div>
              <label class="block text-[#34383D] text-[15px] font-medium mb-1.5">Time Zone</label>
              <div class="flex gap-2 items-center">
                <UInput
                  v-model="settings.timeZone"
                  placeholder="werunfjjak11"
                  :disabled="!isEditing('timeZone')"
                  class="flex-1"
                  :ui="{ base: 'rounded-[8px] py-2.5 px-4 disabled:bg-white disabled:cursor-default' }"
                />
                <UButton
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="outline"
                  :ui="{ base: 'rounded-[8px] p-2.5', leadingIcon: 'size-5' }"
                  @click="toggleEdit('timeZone')"
                />
              </div>
            </div>

            <!-- Platform Status -->
            <div>
              <label class="block text-[#34383D] text-[15px] font-medium mb-1.5">Platform Status</label>
              <USelect
                v-model="settings.platformStatus"
                :items="platformStatusOptions"
                value-key="value"
                :ui="{ base: 'rounded-[8px] py-2.5 px-4', trailingIcon: 'size-5' }"
                class="w-full"
              />
            </div>
          </div>
        </template>

        <!-- Security Section -->
        <template v-else-if="activeSection === 'security'">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-[#34383D] text-[20px] font-bold">
              Security
            </h3>
            <UButton
              label="Update"
              color="primary"
              :ui="{ base: 'rounded-full px-8 py-2.5', label: 'font-semibold text-[16px]' }"
              @click="handleUpdate"
            />
          </div>

          <div class="flex flex-col divide-y divide-[#E5E7EB]">
            <div class="flex justify-between items-center py-5">
              <div>
                <p class="text-[#34383D] text-[15px] font-semibold">
                  Two-Factor Authentication
                </p>
                <p class="text-[#6B7280] text-[14px] mt-0.5">
                  {{ security.twoFactorAuth ? 'On' : 'Off' }}
                </p>
              </div>
              <USwitch v-model="security.twoFactorAuth" color="success" />
            </div>

            <div class="flex justify-between items-center py-5">
              <div>
                <p class="text-[#34383D] text-[15px] font-semibold">
                  Login Alert
                </p>
                <p class="text-[#6B7280] text-[14px] mt-0.5">
                  {{ security.loginAlert ? 'On' : 'Off' }}
                </p>
              </div>
              <USwitch v-model="security.loginAlert" color="success" />
            </div>

            <div class="flex justify-between items-center py-5">
              <div>
                <p class="text-[#34383D] text-[15px] font-semibold">
                  Time Out
                </p>
                <p class="text-[#6B7280] text-[14px] mt-0.5">
                  {{ security.timeOut ? 'On' : 'Off' }}
                </p>
              </div>
              <USwitch v-model="security.timeOut" color="success" />
            </div>
          </div>
        </template>

        <!-- Payment Section -->
        <template v-else-if="activeSection === 'payment'">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-[#34383D] text-[20px] font-bold">
              Payment
            </h3>
            <UButton
              label="Update"
              color="primary"
              :ui="{ base: 'rounded-full px-8 py-2.5', label: 'font-semibold text-[16px]' }"
              @click="handleUpdate"
            />
          </div>

          <div class="flex flex-col divide-y divide-[#E5E7EB] mb-6">
            <div class="flex justify-between items-center py-5">
              <div>
                <p class="text-[#34383D] text-[15px] font-semibold">
                  Wallet Funding
                </p>
                <p class="text-[#6B7280] text-[14px] mt-0.5">
                  {{ payment.walletFunding ? 'On' : 'Off' }}
                </p>
              </div>
              <USwitch v-model="payment.walletFunding" color="success" />
            </div>

            <div class="flex justify-between items-center py-5">
              <div>
                <p class="text-[#34383D] text-[15px] font-semibold">
                  Wallet Payment
                </p>
                <p class="text-[#6B7280] text-[14px] mt-0.5">
                  {{ payment.walletPayment ? 'On' : 'Off' }}
                </p>
              </div>
              <USwitch v-model="payment.walletPayment" color="success" />
            </div>

            <div class="flex justify-between items-center py-5">
              <div>
                <p class="text-[#34383D] text-[15px] font-semibold">
                  Paystack Payment
                </p>
                <p class="text-[#6B7280] text-[14px] mt-0.5">
                  {{ payment.paystackPayment ? 'On' : 'Off' }}
                </p>
              </div>
              <USwitch v-model="payment.paystackPayment" color="success" />
            </div>
          </div>

          <div class="flex flex-col gap-5">
            <div>
              <label class="block text-[#34383D] text-[15px] font-semibold mb-1.5">Transaction Charges</label>
              <div class="flex gap-2 items-center">
                <UInput
                  v-model="payment.transactionCharges"
                  :disabled="!isEditingPayment('transactionCharges')"
                  class="flex-1"
                  :ui="{ base: 'rounded-[8px] py-2.5 px-4 disabled:bg-white disabled:cursor-default' }"
                />
                <UButton
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="outline"
                  :ui="{ base: 'rounded-[8px] p-2.5', leadingIcon: 'size-5' }"
                  @click="togglePaymentEdit('transactionCharges')"
                />
              </div>
            </div>

            <div>
              <label class="block text-[#34383D] text-[15px] font-semibold mb-1.5">Minimum Funding</label>
              <div class="flex gap-2 items-center">
                <UInput
                  v-model="payment.minimumFunding"
                  :disabled="!isEditingPayment('minimumFunding')"
                  class="flex-1"
                  :ui="{ base: 'rounded-[8px] py-2.5 px-4 disabled:bg-white disabled:cursor-default' }"
                />
                <UButton
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="outline"
                  :ui="{ base: 'rounded-[8px] p-2.5', leadingIcon: 'size-5' }"
                  @click="togglePaymentEdit('minimumFunding')"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- Placeholder for other sections -->
        <template v-else>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-[#34383D] text-[20px] font-bold capitalize">
              {{ navItems.find(n => n.key === activeSection)?.label }}
            </h3>
          </div>
          <p class="text-[#9CA3AF] text-[15px]">
            This section is coming soon.
          </p>
        </template>
      </div>
    </div>
  </main>
</template>
