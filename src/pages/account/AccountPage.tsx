import { Container } from "react-bootstrap";
import AccountSummary from "../../features/account/AccountSummary";

function AccountPage() {
  return (
    <Container className="mt-4">
      <h4 className="mb-3">アカウント</h4>
      <AccountSummary />
      {/* 今後: パスワード変更 / 設定 / 統計など追加 */}
    </Container>
  );
}

export default AccountPage;
