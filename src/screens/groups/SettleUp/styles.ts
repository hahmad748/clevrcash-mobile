import {StyleSheet} from 'react-native';
import {TOTAL_TAB_BAR_HEIGHT} from '../../../components/CustomTabBar/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: TOTAL_TAB_BAR_HEIGHT + 20,
  },
  pageHeader: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'visible',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Paid By Section (similar to CreateExpense)
  paidBySection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  paidByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  paidByText: {
    fontSize: 16,
    fontWeight: '500',
  },
  paidByButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minHeight: 36,
    justifyContent: 'center',
    gap: 4,
  },
  paidByButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    paddingBottom: 8,
    borderBottomWidth: 2,
  },
  // Receipt Section
  receiptArea: {
    width: '100%',
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  receiptText: {
    fontSize: 14,
    fontWeight: '500',
  },
  receiptHint: {
    fontSize: 12,
    marginTop: 4,
  },
  receiptPreviewContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  receiptPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  receiptDocumentPreview: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  receiptDocumentName: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: '80%',
  },
  removeReceiptButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Notes Section
  addNotesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  addNotesText: {
    fontSize: 16,
    fontWeight: '500',
  },
  notesInput: {
    minHeight: 100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
